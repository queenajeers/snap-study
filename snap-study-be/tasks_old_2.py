import os
import json
import asyncio
import tempfile
import requests
import fitz  # PyMuPDF
import aiohttp
from firebase_config import db,bucket
from worker import celery_app
import math
import time

MAX_RETRIES = 3
CHUNK_SIZE = 12
LLM_MODEL = "mistralai/ministral-3b"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
    "Content-Type": "application/json"
}

@celery_app.task
def process_the_source(uid: str, project_id: str, source_id: str, filePath: str):
    asyncio.run(process_document(uid, project_id, source_id, filePath))

async def process_document(uid: str, project_id: str, source_id: str, downloadURL: str):
    source_path = f"users/{uid}/projects/{project_id}/sources/{source_id}"
    source_ref = db.reference(source_path)
    source_ref.update({
        "processingStarted": True,
        "processingFinished": False,
        "processingProgress": 0,
        "downloadStatus": 0
    })

    topics_ref = db.reference(f"{source_path}/topics")

    try:
        # Step 1: Download PDF with progress tracking
        blob_path = downloadURL  # e.g., "users/uid/projects/pid/sources/sid.pdf"
        blob = bucket.blob(blob_path)
        blob.reload() 
        file_size = blob.size or 1  # Avoid division by zero
        if not file_size or file_size <= 0:
            raise ValueError("Could not determine valid file size for progress tracking.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            with blob.open("rb") as blob_file:
                bytes_read = 0
                chunk_size = 1024 * 1024  # 1 MB

                while True:
                    chunk = blob_file.read(chunk_size)
                    if not chunk:
                        break

                    tmp.write(chunk)
                    tmp.flush()  # Ensure data is written to disk
                    bytes_read += len(chunk)
                    progress = min(100, math.floor((bytes_read / file_size) * 100))
                    print(progress)
                    source_ref.update({"downloadStatus": progress})
                    time.sleep(0.1)

            pdf_path = tmp.name

        source_ref.update({"downloadStatus": 100})

        # Step 2: Open PDF and split into chunks
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        chunks = []

        for i in range(0, total_pages, CHUNK_SIZE):
            start = i
            end = min(i + CHUNK_SIZE, total_pages)
            text = ""
            pages_included = []

            for j in range(start, end):
                page_num = j + 1
                pages_included.append(page_num)
                page_text = doc[j].get_text()
                text += f"\n--- Page {page_num} ---\n{page_text}"

            chunks.append({
                "index": len(chunks),
                "start": start + 1,
                "end": end,
                "pages_included": pages_included,
                "text": text
            })

        # Step 3: Process chunks asynchronously
        total_chunks = len(chunks)
        async with aiohttp.ClientSession() as session:
            tasks = [
                process_chunk(session, chunk, topics_ref, total_chunks, source_ref)
                for chunk in chunks
            ]
            await asyncio.gather(*tasks)

        source_ref.update({
            "processingFinished": True,
            "processingProgress": 100
        })

    except Exception as e:
        source_ref.update({
            "processingFinished": False,
            "error": str(e),
            "downloadStatus": -1  # Indicate failure
        })



async def process_chunk(session, chunk, topics_ref, total_chunks, source_ref):
    index = chunk["index"]
    retries = 0
    success = False

    while retries < MAX_RETRIES and not success:
        try:
            prompt = f"""
You are a document analysis assistant. Carefully extract key **topics** from the given text and assign each topic to a specific page range.

Guidelines:
- Break the chunk into **smaller logical topic sections** (e.g. every 2–5 pages).
- Each topic must be mapped to the **actual pages** where it appears, not the whole chunk.
- Use this JSON format: {{ "Topic Title": [startPage, endPage], ... }}
- Do not include generic titles like "Introduction", "Conclusion", etc.
- No Markdown, no explanations — output **only valid JSON**.

Pages included: {chunk['pages_included']}

Text to analyze:
{chunk['text']}
"""
            payload = {
                "model": LLM_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant for document structure extraction."},
                    {"role": "user", "content": prompt}
                ]
            }

            async with session.post(OPENROUTER_URL, headers=HEADERS, json=payload, timeout=120) as resp:
                result = await resp.json()
                content = result["choices"][0]["message"]["content"]

                try:
                    topics_json = json.loads(content)
                    topics = list(topics_json.keys())

                    await write_chunk_result(
                        topics_ref, index, topics, chunk["start"], chunk["end"]
                    )

                    # Update processingProgress
                    progress = int(((index + 1) / total_chunks) * 100)
                    source_ref.update({"processingProgress": progress})

                    success = True
                except json.JSONDecodeError:
                    retries += 1
                    await asyncio.sleep(2)

        except Exception as e:
            retries += 1
            await asyncio.sleep(2)

    if not success:
        await write_chunk_result(
            topics_ref, index, [], chunk["start"], chunk["end"], error="Failed after retries"
        )


async def write_chunk_result(topics_ref, index, topics, start_page, end_page, error=None):
    data = {
        "topics": topics,
        "pageRange": [start_page, end_page]
    }
    if error:
        data["error"] = error
    topics_ref.child(str(index)).set(data)
