# from upload_file import upload_user_file
# from pinecone_functions import load_document,split_documents,prepare_metadata_chunks,recommend_chunking_params


# docs = load_document("Hemodymamic.pdf")
# chunk_size, chunk_overlap = recommend_chunking_params(docs)
# split_docs = split_documents(docs, chunk_size, chunk_overlap)
# chunks = prepare_metadata_chunks(split_docs,"Hemodymamic")


# app/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from tasks import process_the_source,create_content

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=False,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)



# def process_the_source(uid:str,project_id:str,source_id:str,downloadURL:str):

# Define a post method here which calls this function process_the_source
class SourceRequest(BaseModel):
    uid: str
    project_id: str
    source_id: str
    filePath: str

@app.post("/process_source")
def process_source(request: SourceRequest):
    # Assuming process_the_source returns something useful
    task = process_the_source.delay(
        uid=request.uid,
        project_id=request.project_id,
        source_id=request.source_id,
        filePath=request.filePath
    )
    return {
        "message": "Started processing the source",
        "task_id": task.id  # ✅ this is safe to serialize
    }

@app.get("/")
def process_source(request: SourceRequest):
   
    return {
        "Running"
    }

class CreateContentRequest(BaseModel):
    uid: str
    project_id: str
    content_type: str
    filePath: str
    selected_topics: list

@app.post("/create_content")
def create_content_(request: CreateContentRequest):
    body =  request.model_dump_json()  # read the raw JSON payload
    print("🔥 Received raw request body:", body)
    task = create_content.delay(
        uid = request.uid,
        project_id = request.project_id,
        content_type = request.content_type,
        filePath = request.filePath,
        selected_topics = request.selected_topics
                                )
    return {
        "message": "Started processing the source",
        "task_id": task.id  # ✅ this is safe to serialize
    }

# create_content(uid: str, project_id: str, content_type: str, filePath: str, selected_topics: list):