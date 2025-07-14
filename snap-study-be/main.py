# from upload_file import upload_user_file
# from pinecone_functions import load_document,split_documents,prepare_metadata_chunks,recommend_chunking_params


# docs = load_document("Hemodymamic.pdf")
# chunk_size, chunk_overlap = recommend_chunking_params(docs)
# split_docs = split_documents(docs, chunk_size, chunk_overlap)
# chunks = prepare_metadata_chunks(split_docs,"Hemodymamic")


# app/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from tasks import long_running_task
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from tasks import process_the_source

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

class TaskRequest(BaseModel):
    data: str

@app.post("/process")
def process_data(request: TaskRequest):
    task = long_running_task.delay(request.data)
    return {"message": "Task received!", "task_id": task.id}


# def process_the_source(uid:str,project_id:str,source_id:str,downloadURL:str):

# Define a post method here which calls this function process_the_source
class SourceRequest(BaseModel):
    uid: str
    project_id: str
    source_id: str
    downloadURL: str

@app.post("/process_source")
def process_source(request: SourceRequest):
    # Assuming process_the_source returns something useful
    task = process_the_source.delay(
        uid=request.uid,
        project_id=request.project_id,
        source_id=request.source_id,
        downloadURL=request.downloadURL
    )
    return {
        "message": "Started processing the source",
        "task_id": task.id  # ✅ this is safe to serialize
    }
