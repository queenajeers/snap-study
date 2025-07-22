import os
import json
import asyncio
import tempfile
import requests
import uuid
import fitz  # PyMuPDF
import aiohttp
from firebase_config import db, bucket
from worker import celery_app
import math
import time
import logging
import re
from datetime import datetime
from typing import Optional, Dict, Any
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


MAX_RETRIES = 3
CHUNK_SIZE = 12
LLM_MODEL = "google/gemini-2.0-flash-001"
OPENAI_MODEL="openai/gpt-4o-mini"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
    "Content-Type": "application/json"
}

class DownloadProgressTracker:
    """Professional download progress tracker with multiple reporting methods"""
    
    def __init__(self, source_ref, file_size: int, chunk_size: int = 1024 * 1024):
        self.source_ref = source_ref
        self.file_size = file_size
        self.chunk_size = chunk_size
        self.bytes_downloaded = 0
        self.start_time = time.time()
        self.last_update_time = 0
        self.update_interval = 0.5  # Update every 500ms to avoid too frequent updates
        
    def update_progress(self, bytes_read: int) -> Dict[str, Any]:
        """Update download progress and return progress info"""
        self.bytes_downloaded += bytes_read
        current_time = time.time()
        
        # Calculate progress percentage
        progress_percent = min(100, math.floor((self.bytes_downloaded / self.file_size) * 100))
        
        # Calculate download speed and ETA
        elapsed_time = current_time - self.start_time
        download_speed = self.bytes_downloaded / elapsed_time if elapsed_time > 0 else 0
        
        # Calculate ETA
        remaining_bytes = self.file_size - self.bytes_downloaded
        eta_seconds = remaining_bytes / download_speed if download_speed > 0 else 0
        
        progress_info = {
            "progress": progress_percent,
            "bytesDownloaded": self.bytes_downloaded,
            "totalBytes": self.file_size,
            "downloadSpeed": download_speed,
            "eta": eta_seconds,
            "elapsedTime": elapsed_time,
            "timestamp": datetime.now().isoformat()
        }
        
        # Update Firebase only if enough time has passed (throttling)
        if current_time - self.last_update_time >= self.update_interval:
            try:
                self.source_ref.update({
                    "downloadStatus": progress_percent,
                    "downloadProgress": progress_info
                })
                self.last_update_time = current_time
                
                # Log progress professionally
                self._log_progress(progress_info)
                
            except Exception as e:
                logger.error(f"Failed to update download progress: {e}")
        
        return progress_info
    
    def _log_progress(self, progress_info: Dict[str, Any]):
        """Log progress in a professional format"""
        speed_mb = progress_info["downloadSpeed"] / (1024 * 1024)
        eta_min = progress_info["eta"] / 60
        
        logger.info(
            f"Download Progress: {progress_info['progress']}% "
            f"({self._format_bytes(progress_info['bytesDownloaded'])} / "
            f"{self._format_bytes(progress_info['totalBytes'])}) "
            f"Speed: {speed_mb:.2f} MB/s "
            f"ETA: {eta_min:.1f} min"
        )
    
    @staticmethod
    def _format_bytes(bytes_size: int) -> str:
        """Format bytes in human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes_size < 1024.0:
                return f"{bytes_size:.1f} {unit}"
            bytes_size /= 1024.0
        return f"{bytes_size:.1f} TB"
    
    def finalize(self):
        """Finalize the download progress"""
        final_info = {
            "progress": 100,
            "bytesDownloaded": self.file_size,
            "totalBytes": self.file_size,
            "downloadSpeed": self.file_size / (time.time() - self.start_time),
            "completed": True,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            self.source_ref.update({
                "downloadStatus": 100,
                "downloadProgress": final_info,
                "downloadCompleted": True
            })
            logger.info("Download completed successfully")
        except Exception as e:
            logger.error(f"Failed to finalize download progress: {e}")

@celery_app.task
def process_the_source(uid: str, project_id: str, source_id: str, filePath: str):
    """Process document with professional progress tracking"""
    asyncio.run(process_document(uid, project_id, source_id, filePath))

async def process_document(uid: str, project_id: str, source_id: str, downloadURL: str):
    """Process document with enhanced progress tracking"""
    source_path = f"users/{uid}/projects/{project_id}/sources/{source_id}"
    source_ref = db.reference(source_path)
    
    # Initialize processing status
    source_ref.update({
        "processingStarted": True,
        "processingFinished": False,
        "processingProgress": 0,
        "downloadStatus": 0,
        "stage": "initializing",
        "startTime": datetime.now().isoformat()
    })

    topics_ref = db.reference(f"{source_path}/topics")

    try:
        # Step 1: Enhanced PDF Download with Professional Progress Tracking
        logger.info(f"Starting document processing for source: {source_id}")
        
        blob_path = downloadURL
        blob = bucket.blob(blob_path)
        blob.reload()
        file_size = blob.size or 1
        
        if not file_size or file_size <= 0:
            raise ValueError("Could not determine valid file size for progress tracking.")

        # Update stage
        source_ref.update({"stage": "downloading", "fileSize": file_size})
        
        # Initialize progress tracker
        progress_tracker = DownloadProgressTracker(source_ref, file_size)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            with blob.open("rb") as blob_file:
                
                while True:
                    chunk = blob_file.read(progress_tracker.chunk_size)
                    if not chunk:
                        break

                    tmp.write(chunk)
                    tmp.flush()
                    
                    # Update progress professionally
                    progress_tracker.update_progress(len(chunk))
                    
                    # Small delay to prevent overwhelming the system
                    await asyncio.sleep(0.01)

            pdf_path = tmp.name

        # Finalize download progress
        progress_tracker.finalize()
        
        # Step 2: Document Processing Stage
        source_ref.update({"stage": "processing", "processingProgress": 0})
        logger.info("Starting document text extraction and chunking")
        
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

        # Step 3: Process chunks with progress tracking
        source_ref.update({
            "stage": "analyzing",
            "totalChunks": len(chunks),
            "chunksProcessed": 0
        })
        
        logger.info(f"Processing {len(chunks)} chunks for topic extraction")
        
        total_chunks = len(chunks)
        async with aiohttp.ClientSession() as session:
            tasks = [
                process_chunk(session, chunk, topics_ref, total_chunks, source_ref)
                for chunk in chunks
            ]
            await asyncio.gather(*tasks)

        # Final completion
        source_ref.update({
            "processingFinished": True,
            "processingProgress": 100,
            "stage": "completed",
            "completedTime": datetime.now().isoformat()
        })
        
        logger.info(f"Document processing completed successfully for source: {source_id}")

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Document processing failed for source {source_id}: {error_msg}")
        
        source_ref.update({
            "processingFinished": False,
            "error": error_msg,
            "downloadStatus": -1,
            "stage": "failed",
            "errorTime": datetime.now().isoformat()
        })
        
    finally:
        # Clean up temporary file
        try:
            if 'pdf_path' in locals():
                os.unlink(pdf_path)
        except:
            pass

async def process_chunk(session, chunk, topics_ref, total_chunks, source_ref):
    """Process chunk with enhanced error handling and progress tracking"""
    index = chunk["index"]
    retries = 0
    success = False

    while retries < MAX_RETRIES and not success:
        try:
            prompt = f"""
You are a medical document analysis assistant. Your task is to extract only the **main medical topics or sections** from the provided text and assign each to the **specific page range** where it appears.

Instructions:
- Focus on **high-level medical topics** such as diseases, treatments, diagnostics, procedures, or core subject areas.
- Ignore minor subheadings like "Definition", "Overview", "Etiology", "Classification", "A", "B", etc.
- Do not include generic titles such as "Introduction", "Conclusion", or "References".
- Each topic should represent a **meaningful, self-contained subject** that spans about 2–5 pages.
- Use this exact JSON format: {{ "Topic Title": [startPage, endPage], ... }}
- Return **only valid JSON** — no explanations, no Markdown.

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
            
                raw_content = result["choices"][0]["message"]["content"]
                try:
                    topics_json = extract_json_from_text(raw_content)
                except ValueError as e:
                    logger.warning(f"JSON extraction failed: {e}")
                    raise
                
                try:
                    
                    topics = list(topics_json.keys())

                    await write_chunk_result(
                        topics_ref, index, topics, chunk["start"], chunk["end"]
                    )

                    # Update processing progress with more detail
                    progress = int(((index + 1) / total_chunks) * 100)
                    source_ref.update({
                        "processingProgress": progress,
                        "chunksProcessed": index + 1,
                        "lastProcessedChunk": index
                    })

                    success = True
                    logger.debug(f"Successfully processed chunk {index + 1}/{total_chunks}")
                    
                except json.JSONDecodeError as e:
                    retries += 1
                    logger.warning(f"JSON decode error for chunk {index}, retry {retries}: {e}")
                    await asyncio.sleep(2)

        except Exception as e:
            retries += 1
            logger.warning(f"Error processing chunk {index}, retry {retries}: {e}")
            await asyncio.sleep(2)

    if not success:
        logger.error(f"Failed to process chunk {index} after {MAX_RETRIES} retries")
        await write_chunk_result(
            topics_ref, index, [], chunk["start"], chunk["end"], error="Failed after retries"
        )

async def write_chunk_result(topics_ref, index, topics, start_page, end_page, error=None):
    """Write chunk result with timestamp"""
    data = {
        "topics": topics,
        "pageRange": [start_page, end_page],
        "processedAt": datetime.now().isoformat()
    }
    if error:
        data["error"] = error
    topics_ref.child(str(index)).set(data)


def extract_json_from_text(text: str) -> dict:
    """
    Extract and clean JSON from a string that may contain markdown or extra text.
    """
    try:
        # Match any JSON object (including nested ones)
        match = re.search(r'{[\s\S]*}', text)
        if not match:
            raise ValueError("No valid JSON block found in the response.")

        json_str = match.group()
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}")
    

@celery_app.task
def create_content(uid: str, project_id: str, content_type: str, filePath: str, selected_topics: list):
    asyncio.run(handle_content(uid, project_id, content_type, filePath, selected_topics))

async def handle_content(uid: str, project_id: str, content_type: str, filePath: str, selected_topics: list):
    content_id = f"id-{uuid.uuid4().hex}"

    content_ref = db.reference(f"users/{uid}/projects/{project_id}/contents/{content_id}")
    
    # Initialize content metadata in Firebase
    content_ref.set({
        "creationInProgress": True,
        "contentType": content_type,
        "flashcards": [],
        "createdAt": datetime.now().isoformat()
    })

     # Collect topic names
    topic_names = [topic.get("topic", "").strip() for topic in selected_topics if topic.get("topic")]
    topic_names_string = ", ".join(topic_names)

    # Add topicNames field
    content_ref.update({
        "topicNames": topic_names_string
    })

    # Download PDF
    try:
        blob = bucket.blob(filePath)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            blob.download_to_file(tmp)
            pdf_path = tmp.name
    except Exception as e:
        logger.error(f"Failed to download file: {e}")
        content_ref.update({"creationInProgress": False, "error": str(e)})
        return

    try:
        doc = fitz.open(pdf_path)
        async with aiohttp.ClientSession() as session:
            for topic in selected_topics:
                min_page = topic.get("minPage")
                max_page = topic.get("maxPage")
                topic_title = topic.get("topic")

                text = ""
                for i in range(min_page - 1, max_page):
                    try:
                        text += f"\n--- Page {i+1} ---\n{doc[i].get_text()}"
                    except Exception as e:
                        logger.warning(f"Error reading page {i+1}: {e}")
                
                # Generate flashcards for this topic
                flashcards = await generate_flashcards(session, text, topic_title, uid)
                
                # Append flashcards to Firebase
                for card in flashcards:
                    content_ref.child("flashcards").push(card)

    except Exception as e:
        logger.error(f"Error during content generation: {e}")
        content_ref.update({"creationInProgress": False, "error": str(e)})
        return
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
    
    content_ref.update({"creationInProgress": False, "completedAt": datetime.now().isoformat()})
    logger.info(f"Flashcards successfully created under content {content_id}")

async def generate_flashcards(session, topic_text: str, topic_title: str, uid: str):
    """Generate flashcards using LLM from a topic text"""
    prompt = f"""
You are a medical flashcard creation assistant. Based on the following topic titled "{topic_title}", generate a set of high-quality educational flashcards.

**Flashcard Requirements**:
- Each flashcard must include:
  - **front**: A clear and focused question or prompt designed to test understanding of the topic.
  - **back**: A comprehensive, medically accurate answer or explanation written in a clear and concise style.
  - **backImagePrompt**: A brief, descriptive prompt for generating a **diagram-style image** that would aid in memory and understanding.

**Image Prompt Guidelines**:
- Describe a **clean, text-free anatomical or conceptual diagram** that would help a medical student quickly understand or recall the concept.
- Diagrams should be clear and visually organized, but must **not include any text, labels, or annotations**.
- If no visual aid would be useful for this flashcard, return the exact string: `"none"`.
- Avoid photorealistic images, clinical photos, or illustrations with human subjects. Focus on **abstract or anatomical diagrams** only.

**Response Format**:
- Return only valid JSON in the following format (no markdown, no explanation):

[
  {{
    "front": "Your question here",
    "back": "Your detailed answer here",
    "backImagePrompt": "Diagram prompt here" or "none"
  }},
  ...
]

**Topic Text**:
{topic_text}
"""




    payload = {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful flashcard generation assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        async with session.post(OPENROUTER_URL, headers=HEADERS, json=payload, timeout=120) as resp:
            result = await resp.json()
            raw = result["choices"][0]["message"]["content"]
            flashcards = extract_flashcards_json(raw)
            
            # Generate image if backImagePrompt is present
            updated_flashcards = []
            for card in flashcards:
                prompt = card.get("backImagePrompt", "").strip()
                if prompt!="none":
                    image_url = await generate_image_and_upload(prompt, uid)
                    card["imageUrl"] = image_url
                updated_flashcards.append(card)

            return updated_flashcards

    except Exception as e:
        logger.error(f"LLM request failed: {e}")
        return []


import os
import uuid
from typing import Optional

async def generate_image_and_upload(prompt: str, uid: str) -> Optional[str]:
    """Generate image using Google Gemini and upload to Firebase, returning the public URL."""
    try:
        from google import genai
        from google.genai import types
        from PIL import Image
        import logging

        # Use your logger (or fallback to print if not available)
        logger = logging.getLogger(__name__)

        # Initialize Gemini client
        client = genai.Client(api_key="AIzaSyDnDOvevf8bl85symrWVu2BLHmEYP-4-D4")

        # Generate image using Gemini
        response = client.models.generate_images(
            model='imagen-4.0-generate-preview-06-06',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1"
            )
        )

        if not response.generated_images:
            logger.warning(f"No image generated for prompt: {prompt}")
            return None

        # Get the first generated image (PIL.Image object)
        generated_image = response.generated_images[0]
        image = generated_image.image

        # Save locally (temporary file)
        filename = f"{uuid.uuid4().hex}.png"
        local_path = os.path.join(os.getcwd(), filename)
        image.save(local_path)

        # Upload to Firebase Storage
        from firebase_admin import storage  # Assuming Firebase Admin SDK is initialized
        bucket = storage.bucket()
        firebase_path = f"users/{uid}/project_image_generations/{filename}"
        blob = bucket.blob(firebase_path)
        blob.upload_from_filename(local_path)
        blob.make_public()

        # Clean up local file
        os.remove(local_path)

        return blob.public_url

    except Exception as e:
        logger.error(f"Gemini image generation/upload failed: {e}")
        return None



async def generate_image_and_upload_old(prompt: str, uid: str) -> Optional[str]:
    """Generate image from prompt and upload to Firebase, return public URL"""
    try:
        from openai import OpenAI
        import base64

        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
            tools=[{"type": "image_generation"}],
        )

        image_data = [
            output.result
            for output in response.output
            if output.type == "image_generation_call"
        ]

        if not image_data:
            logger.warning(f"No image generated for prompt: {prompt}")
            return None

        image_base64 = image_data[0]
        filename = f"{uuid.uuid4().hex}.png"
        local_path = os.path.join(tempfile.gettempdir(), filename)
        
        with open(local_path, "wb") as f:
            f.write(base64.b64decode(image_base64))

        # Upload to Firebase Storage
        firebase_path = f"users/{uid}/project_image_generations/{filename}"
        blob = bucket.blob(firebase_path)
        blob.upload_from_filename(local_path)
        blob.make_public()

        os.remove(local_path)

        return blob.public_url

    except Exception as e:
        logger.error(f"Image generation/upload failed: {e}")
        return None

def extract_flashcards_json(text: str):
    """Extract valid JSON flashcards from LLM output"""
    try:
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if not match:
            raise ValueError("No JSON array found in response.")
        json_str = match.group()
        cards = json.loads(json_str)
        return [
            {
                "front": card.get("front", "").strip(),
                "back": card.get("back", "").strip(),
                "backImagePrompt": card.get("backImagePrompt", "").strip()
            }
            for card in cards if "front" in card and "back" in card
        ]
    except Exception as e:
        logger.warning(f"Failed to extract flashcards JSON: {e}")
        return []


