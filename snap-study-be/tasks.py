import os
import json
import asyncio
import tempfile
import requests
import fitz  # PyMuPDF
import aiohttp
from firebase_config import db, bucket
from worker import celery_app
import math
import time
import logging
from datetime import datetime
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MAX_RETRIES = 3
CHUNK_SIZE = 12
LLM_MODEL = "mistralai/ministral-3b"
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