# app/tasks.py

from time import sleep
from worker import celery_app
from firebase_config import db
import fitz  # PyMuPDF
import requests
import tempfile
from openai import OpenAI
import os
import json
import re
import math
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@celery_app.task
def long_running_task(data: str):
    print(f"📦 Task started with data: {data}")
    sleep(10)  # Simulates long processing time
    print("✅ Task finished!")
    return f"Processed: {data}"


# @celery_app.task
# def process_the_source(uid: str, project_id: str, source_id: str, downloadURL: str):
#     source_path = f"users/{uid}/projects/{project_id}/sources/{source_id}"
#     source_ref = db.reference(source_path)
#     source_ref.update({"processingStarted": True, "processingFinished": False})

#     try:
#         # Download PDF
#         response = requests.get(downloadURL)
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
#             tmp.write(response.content)
#             pdf_path = tmp.name

#         # Step 1: Chunk PDF
#         doc = fitz.open(pdf_path)
#         total_pages = len(doc)
#         chunk_size = 30
#         overlap = 1
#         chunks = []

#         i = 0
#         while i < total_pages:
#             start = i
#             end = min(i + chunk_size, total_pages)
#             text = ""
#             pages_included = []
#             for j in range(start, end):
#                 page_num = j + 1
#                 pages_included.append(page_num)
#                 page_text = doc[j].get_text()
#                 text += f"\n--- Page {page_num} ---\n" + page_text
#             chunks.append({
#     "start": start + 1,
#     "end": end,
#     "text": text,
#     "pages_included": pages_included
# })

#             i += chunk_size - overlap

#         # Step 3: Extract topics from each chunk using GPT
#         all_topics = []

#         for chunk in chunks:
#             prompt = f"""
# You are a highly intelligent document assistant. Given the following text (from pages {chunk['start']}-{chunk['end']}), extract a meaningful and structured Table of Contents.

# Your job is to:
# - Identify **distinct Main Topics** and relevant **Subtopics**.
# - For each **Main Topic**, write a clear and descriptive title that **summarizes the theme or concept**, not just a generic label.
# - Avoid bland headings like "Introduction", "Definition", or "Overview" — instead, explain *what* is being introduced or defined.
# - Group Subtopics under the correct Main Topic.
# - Each topic must include a **pageRange** as [start, end].

# ⚠️ Important: Some pages in this range may not show up in the text below (e.g., diagram-only pages). However, they are included in the source's `pages_included` list. If you infer that a topic or subtopic spans multiple pages, include **all relevant pages** from that list in the pageRange — even if they contain no visible text.

# pages_included: {chunk['pages_included']}

# Output format (JSON, no extra text):
# {{
#   "Main Topic Title": {{
#     "pageRange": [start, end],
#     "subtopics": {{
#       "Subtopic Title": [start, end],
#       ...
#     }}
#   }},
#   ...
# }}

# Example:
# {{
#   "Design Principles of Dental Prosthetics": {{
#     "pageRange": [1, 4],
#     "subtopics": {{
#       "Role of Posterior Teeth in Function and Aesthetics": [2, 2],
#       "Materials and Shapes Used in Tooth Design": [3, 4]
#     }}
#   }}
# }}

# Here is the extracted text:
# {chunk['text']}
# """
#             res = client.responses.create(
#                 model="gpt-4",
#                 input=[
#                     {"role": "system", "content": "You are an expert in document analysis."},
#                     {"role": "user", "content": prompt}
#                 ]
#             )
#             all_topics.append({
#     "start": chunk["start"],
#     "end": chunk["end"],
#     "pages_included": chunk["pages_included"],
#     "toc": res.output_text
# })

#         # Step 4: Merge topics using GPT
#         merge_prompt = """
# You are a smart document assistant. Below are multiple Table of Contents (ToC) extractions from different chunks of a PDF.

# Your job is to:
# - Merge them into a clean, non-repetitive, consistent hierarchy.
# - Group Subtopics under the correct Main Topic.
# - Consolidate overlapping or adjacent page ranges.
# - Ensure every page listed in `pages_included` is reflected in the final merged result.
#   These may include diagram/image-only pages that don’t appear in the extracted text, but must not be dropped.
# - Use inclusive page ranges that cover all meaningful content.

# Output only JSON in this format, no code blocks, no backticks, no comments:

# {
#   "Main Topic": {
#     "pageRange": [start, end],
#     "subtopics": {
#       "Subtopic Title": [start, end],
#       ...
#     }
#   },
#   ...
# }

# Here is the raw extracted content with page context:
# """ + "\n\n---\n\n".join(
#     f"ToC for pages {entry['start']}-{entry['end']} (pages_included: {entry['pages_included']}):\n{entry['toc']}"
#     for entry in all_topics
# )



#         merge_response = client.responses.create(
#             model="gpt-4.1",
#             input=[
#                 {"role": "system", "content": "You are an expert in organizing structured documents."},
#                 {"role": "user", "content": merge_prompt}
#             ]
#         )

#         # Step 5: Load and reformat the JSON to preserve order
#         raw_toc = json.loads(merge_response.output_text)

#         def convert_toc_to_list(toc_dict):
#             toc_list = []
#             for main_title, main_data in toc_dict.items():
#                 entry = {
#                     "title": main_title,
#                     "pageRange": main_data.get("pageRange", []),
#                     "subtopics": []
#                 }
#                 for sub_title, sub_range in main_data.get("subtopics", {}).items():
#                     entry["subtopics"].append({
#                         "title": sub_title,
#                         "pageRange": sub_range
#                     })
#                 toc_list.append(entry)
#             return toc_list

#         ordered_toc = convert_toc_to_list(raw_toc)

#         # Optional: Save raw GPT chunk responses for debugging
#         debug_ref = db.reference(f"users/{uid}/projects/{project_id}/debug/topicsRaw/{source_id}")
#         debug_ref.set({"chunks": all_topics})

#         # Save ordered ToC
#         toc_ref = db.reference(f"users/{uid}/projects/{project_id}/tableOfContents/{source_id}")
#         toc_ref.set(ordered_toc)

#         source_ref.update({"processingFinished": True})

#     except Exception as e:
#         source_ref.update({"processingFinished": False, "error": str(e)})
#         raise e


# @celery_app.task
# def process_the_source(uid: str, project_id: str, source_id: str, downloadURL: str):
#     source_path = f"users/{uid}/projects/{project_id}/sources/{source_id}"
#     source_ref = db.reference(source_path)
#     source_ref.update({"processingStarted": True, "processingFinished": False})
#     LLM_MODEL="mistralai/ministral-3b"

#     try:
#         # Download PDF
#         response = requests.get(downloadURL)
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
#             tmp.write(response.content)
#             pdf_path = tmp.name

#         # Step 1: Chunk PDF
#         doc = fitz.open(pdf_path)
#         total_pages = len(doc)
#         chunk_size = 30
#         overlap = 1
#         chunks = []

#         i = 0
#         while i < total_pages:
#             start = i
#             end = min(i + chunk_size, total_pages)
#             text = ""
#             pages_included = []
#             for j in range(start, end):
#                 page_num = j + 1
#                 pages_included.append(page_num)
#                 page_text = doc[j].get_text()
#                 text += f"\n--- Page {page_num} ---\n" + page_text
#             chunks.append({
#     "start": start + 1,
#     "end": end,
#     "text": text,
#     "pages_included": pages_included
# })

#             i += chunk_size - overlap

#         # Step 3: Extract topics from each chunk using GPT
#         all_topics = {}

#         for chunk in chunks:
#             prompt = f"""
# You are a highly intelligent document assistant. Given the following text (from pages {chunk['start']}-{chunk['end']}), extract a meaningful and structured Table of Contents.

# Your job is to:
# - Identify **distinct Main Topics** and relevant **Subtopics**.
# - For each **Main Topic**, write a clear and descriptive title that **summarizes the theme or concept**, not just a generic label.
# - Avoid bland headings like "Introduction", "Definition", or "Overview" — instead, explain *what* is being introduced or defined.
# - Group Subtopics under the correct Main Topic.
# - Each topic must include a **pageRange** as [start, end].
# - Do not drop or ignore pages in pages_included. Use them to extend the pageRange when relevant.

# ⚠️ Important: Some pages in this range may not show up in the text below (e.g., diagram-only pages). Even if a page contains no text, if it is listed in pages_included, it must be included in the appropriate pageRange for any related topic or subtopic. If you infer that a topic or subtopic spans multiple pages, include **all relevant pages** from that list in the pageRange — even if they contain no visible text.
# ⚠️ Do NOT use Markdown formatting like triple backticks (```), code blocks, or labels like "json". Output raw JSON only, nothing else.


# pages_included: {chunk['pages_included']}

# Output format (JSON, no extra text):
# {{
#   "Main Topic Title": {{
#     "pageRange": [start, end],
#     "subtopics": {{
#       "Subtopic Title": [start, end],
#       ...
#     }}
#   }},
#   ...
# }}

# Example:
# {{
#   "Design Principles of Dental Prosthetics": {{
#     "pageRange": [1, 4],
#     "subtopics": {{
#       "Role of Posterior Teeth in Function and Aesthetics": [2, 2],
#       "Materials and Shapes Used in Tooth Design": [3, 4]
#     }}
#   }}
# }}

# Here is the extracted text:
# {chunk['text']}
# """
#             url = "https://openrouter.ai/api/v1/chat/completions"
#             headers = {
#   "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
#   "Content-Type": "application/json"
# } 
#             payload = {
#   "model": LLM_MODEL,
#   "messages": [
#     {"role": "system", "content": "You are an expert in document analysis."},
#     {"role": "user", "content": prompt}
#   ],
#   "response_format": {
#     "type": "json_schema",
#     "json_schema": {
#       "name": "toc_chunk",
#       "strict": True,
#       "schema": {
#         "type": "object",
#         "additionalProperties": {
#           "type": "object",
#           "properties": {
#             "pageRange": {
#               "type": "array",
#               "items": {"type": "integer"},
#               "minItems": 2,
#               "maxItems": 2
#             },
#             "subtopics": {
#               "type": "object",
#               "additionalProperties": {
#                 "type": "array",
#                 "items": {"type": "integer"},
#                 "minItems": 2,
#                 "maxItems": 2
#               }
#             }
#           },
#           "required": ["pageRange", "subtopics"]
#         }
#       }
#     }
#   }
# }

#             response_json = requests.post(url, headers=headers, json=payload)
           
#             result = response_json.json()
#             response = result["choices"][0]["message"]["content"]
           
#             # Only strip markdown if it starts and ends with triple backticks
#             # if response.strip().startswith("```") and response.strip().endswith("```"):
#             #     clean_json_str = re.sub(r"^```(?:json)?\n?|```$", "", response.strip(), flags=re.MULTILINE).strip()
#             # else:
#             #     clean_json_str = response.strip()

#             all_topics.append({
#                 "start": chunk["start"],
#                 "end": chunk["end"],
#                 "pages_included": chunk["pages_included"],
#                 "toc": response
#             })

#         raw_toc_ref = db.reference(f"users/{uid}/projects/{project_id}/tableOfContentsRaw/{source_id}")
#         raw_toc_ref.set(all_topics)

#         # Step 4: Merge topics using GPT
#         merge_prompt = """
# You are a smart document assistant. Below are multiple Table of Contents (ToC) extractions from different chunks of a PDF.

# Your job is to:
# - Merge them into a clean, non-repetitive, consistent hierarchy.
# - Group Subtopics under the correct Main Topic.
# - Avoid bland headings like "Introduction", "Definition", or "Overview" — instead, explain *what* is being introduced or defined.
# - Consolidate overlapping or adjacent page ranges.
# - Ensure every page listed in `pages_included` is reflected in the final merged result.
#   These may include diagram/image-only pages that don’t appear in the extracted text, but must not be dropped.
# - Use inclusive page ranges that cover all meaningful content.

# ⚠️ Critical requirement:
# - **Every page listed in `pages_included` must be covered in the final merged `pageRange`s**.
# - Pages that contain only images/diagrams must still be reflected in the correct topic/subtopic.
# - Do not skip or drop these pages, even if the chunk text does not mention them directly.
# - Use inclusive page ranges that span all pages in `pages_included`.

# ⚠️ Do NOT use Markdown formatting like triple backticks (```), code blocks, or labels like "json". Output raw JSON only, nothing else.


# Output only JSON in this format, no code blocks, no backticks, no comments:

# {
#   "Main Topic": {
#     "pageRange": [start, end],
#     "subtopics": {
#       "Subtopic Title": [start, end],
#       ...
#     }
#   },
#   ...
# }

# Here is the raw extracted content with page context:
# """ + "\n\n---\n\n".join(
#     f"ToC for pages {entry['start']}-{entry['end']} (pages_included: {entry['pages_included']}):\n{entry['toc']}"
#     for entry in all_topics
# )

#         payload = {
#   "model": LLM_MODEL,  # Or gpt-4.1 or whichever model
#   "messages": [
#     {"role": "system", "content": "You are an expert in organizing structured documents."},
#     {"role": "user", "content": merge_prompt}
#   ],
#   "response_format": {
#     "type": "json_schema",
#     "json_schema": {
#       "name": "merged_toc",
#       "strict": True,
#       "schema": {
#         "type": "object",
#         "additionalProperties": {
#           "type": "object",
#           "properties": {
#             "pageRange": {
#               "type": "array",
#               "items": {"type": "integer"},
#               "minItems": 2,
#               "maxItems": 2
#             },
#             "subtopics": {
#               "type": "object",
#               "additionalProperties": {
#                 "type": "array",
#                 "items": {"type": "integer"},
#                 "minItems": 2,
#                 "maxItems": 2
#               }
#             }
#           },
#           "required": ["pageRange", "subtopics"]
#         }
#       }
#     }
#   }
# }


#         merge_response_json = requests.post(url, headers=headers, json=payload)
        
#         result = merge_response_json.json()
#          # Only strip markdown if it starts and ends with triple backticks
#         response = result["choices"][0]["message"]["content"]
#         if response.strip().startswith("```") and response.strip().endswith("```"):
#                 clean_json_str = re.sub(r"^```(?:json)?\n?|```$", "", response.strip(), flags=re.MULTILINE).strip()
#         else:
#                 clean_json_str = response.strip()

#         print(clean_json_str)
#         # Step 5: Load and reformat the JSON to preserve order
#         raw_toc = json.loads(clean_json_str)

#         def convert_toc_to_list(toc_dict):
#             toc_list = []
#             for main_title, main_data in toc_dict.items():
#                 entry = {
#                     "title": main_title,
#                     "pageRange": main_data.get("pageRange", []),
#                     "subtopics": []
#                 }
#                 for sub_title, sub_range in main_data.get("subtopics", {}).items():
#                     entry["subtopics"].append({
#                         "title": sub_title,
#                         "pageRange": sub_range
#                     })
#                 toc_list.append(entry)
#             return toc_list

#         ordered_toc = convert_toc_to_list(raw_toc)

#         # Optional: Save raw GPT chunk responses for debugging
#         debug_ref = db.reference(f"users/{uid}/projects/{project_id}/debug/topicsRaw/{source_id}")
#         debug_ref.set({"chunks": all_topics})

#         # Save ordered ToC
#         toc_ref = db.reference(f"users/{uid}/projects/{project_id}/tableOfContents/{source_id}")
#         toc_ref.set(ordered_toc)

#         source_ref.update({"processingFinished": True})

#     except Exception as e:
#         source_ref.update({"processingFinished": False, "error": str(e)})
#         raise e


@celery_app.task
def process_the_source(uid: str, project_id: str, source_id: str, downloadURL: str):
    
    source_path = f"users/{uid}/projects/{project_id}/sources/{source_id}"
    source_ref = db.reference(source_path)
    source_ref.update({"processingStarted": True, "processingFinished": False})
    
    LLM_MODEL = "mistralai/ministral-3b"

    try:
        # Download PDF
        response = requests.get(downloadURL)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            pdf_path = tmp.name

        # Step 1: Chunk PDF
        # Step 1: Chunk PDF - maximum 50 pages per chunk
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        chunk_size = 50  # Hard limit of 50 pages
        overlap = 1
        chunks = []

        i = 0
        while i < total_pages:
            start = i
            end = min(i + chunk_size, total_pages)
            text = ""
            pages_included = []
            for j in range(start, end):
                page_num = j + 1
                pages_included.append(page_num)
                page_text = doc[j].get_text()
                text += f"\n--- Page {page_num} ---\n" + page_text
        chunks.append({
                "start": start + 1,
                "end": end,
                "text": text,
                "pages_included": pages_included
                  })
        i += chunk_size - overlap  # Overlap is optional and tunable

        # Step 2: Extract topics from each chunk using GPT
        structured_topics = []

        for chunk in chunks:
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


            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": LLM_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant for document structure extraction."},
                    {"role": "user", "content": prompt}
                ]
            }

            response_json = requests.post(url, headers=headers, json=payload)
            response_data = response_json.json()
            content = response_data["choices"][0]["message"]["content"]

            try:
                topics_chunk = json.loads(content)
                topics = list(topics_chunk.keys())

                if topics:  # only store if there are topics
                    structured_topics.append({
                        "topics": topics,
                        "pageRange": [chunk["start"], chunk["end"]]
                    })

            except Exception as e:
                print(f"Failed to parse JSON for chunk: {chunk['start']} - {chunk['end']}")
                raise e

        # Store topics in Firebase
        topics_ref = db.reference(f"users/{uid}/projects/{project_id}/sources/{source_id}/topics")
        topics_ref.set(structured_topics)
        source_ref.update({"processingFinished": True})

    except Exception as e:
        source_ref.update({"processingFinished": False, "error": str(e)})
        raise e
