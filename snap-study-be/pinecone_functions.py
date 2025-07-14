from pinecone import Pinecone
from dotenv import load_dotenv
import os
from datetime import datetime

# Updated imports for LangChain loaders
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()

api_key = os.environ["PINECONE_API"]
pc = Pinecone(api_key=api_key)


# CREATING INDEX

INDEX_NAME = os.environ["PINECONE_INDEX"]

if not pc.has_index(INDEX_NAME):
    pc.create_index_for_model(
        name=INDEX_NAME,
        cloud="aws",
        region="us-east-1",
        embed={
            "model": "llama-text-embed-v2",
            "field_map": {"text": "chunk_text"}
        }
    )

# PREPARING DOCUMENT

def load_document(file_path):
    """Load PDF or TXT file into LangChain Document objects."""
    if file_path.endswith(".pdf"):
        loader = PyPDFLoader(file_path)
        return loader.load_and_split()
    elif file_path.endswith(".txt"):
        loader = TextLoader(file_path)
        return loader.load()
    else:
        raise ValueError("Unsupported file type: must be .pdf or .txt")


def split_documents(docs, chunk_size=500, chunk_overlap=50):
    """Split document into overlapping chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_documents(docs)

def prepare_metadata_chunks(docs, document_title):
    """Format documents with required metadata and page number for Pinecone upsert."""
    document_id = document_title.lower().replace(" ", "_")  # or generate a unique ID
    created_at = datetime.now().strftime("%Y-%m-%d")

    chunks = []
    for i, doc in enumerate(docs, 1):
        chunk = {
            "_id": f"{document_id}#chunk{i}",
            "chunk_text": doc.page_content,
            "page_number": doc.metadata.get("page",None),  # If available
            "created_at": created_at,
        }
        chunks.append(chunk)
    return chunks



def upsert_text(chunks,uid,project_id):
    # Target the index
    dense_index = pc.Index(INDEX_NAME)
    # Upsert the records into a namespace
    return dense_index.upsert_records(construct_namespace(uid,project_id), chunks)

def semantic_search(query,uid,project_id):
    dense_index = pc.Index(INDEX_NAME)
    results = dense_index.search(
    namespace=construct_namespace(uid,project_id),
    query={
        "top_k": 10,
        "inputs": {
            'text': query
        }
    }
    )
    return results



# utility functions

def recommend_chunking_params(docs, max_chunk_size=1000):
    """
    Analyze document lengths and recommend chunking parameters.
    Returns a tuple: (chunk_size, chunk_overlap)
    """
    if not docs:
        raise ValueError("No documents provided")

    # Analyze document lengths
    lengths = [len(doc.page_content) for doc in docs]
    avg_length = sum(lengths) / len(lengths)

    # Decide on chunk_size based on average length
    if avg_length > 3000:
        chunk_size = min(1000, max_chunk_size)
    elif avg_length > 1000:
        chunk_size = 600
    elif avg_length > 500:
        chunk_size = 400
    else:
        chunk_size = 300

    # Overlap: 10% of chunk size
    chunk_overlap = int(chunk_size * 0.1)

    return chunk_size, chunk_overlap


def construct_namespace(uid,project_id):
    return f"{uid}_{project_id}"


# old 

def prepare_metadata_chunks_old(docs, document_title, document_url, document_type="tutorial"):
    """Format documents with metadata for Pinecone upsert."""
    document_id = os.path.splitext(os.path.basename(document_url))[0]
    created_at = datetime.now().strftime("%Y-%m-%d")

    chunks = []
    for i, doc in enumerate(docs, 1):
        chunk = {
            "_id": f"{document_id}#chunk{i}",
            "chunk_text": doc.page_content,
            "document_id": document_id,
            "document_title": document_title,
            "chunk_number": i,
            "document_url": document_url,
            "created_at": created_at,
            "document_type": document_type
        }
        chunks.append(chunk)
    return chunks