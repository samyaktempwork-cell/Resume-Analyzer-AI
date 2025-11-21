from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

from app.services.pdf_extractor import extract_text_from_pdf
from app.services.embedding import get_embedding_model
from app.services.vectorstore import InMemoryVectorStore
from app.services.llm import LLMClient
from app.services.rag import analyze_resume_with_rag

app = FastAPI(title="Resume Analyzer AI")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global singletons for demo purposes
embedding_model = get_embedding_model()
vector_store = InMemoryVectorStore(embedding_model)
llm_client = LLMClient()  # uses external LLM provider (stubbed)


class AnalyzeRequest(BaseModel):
    resume_id: str
    job_description: str


@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    pdf_bytes = await file.read()
    try:
        text = extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {e}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text extracted from PDF")

    # Store as a document in vector store (RAG index)
    resume_id = str(uuid.uuid4())
    vector_store.add_document(doc_id=resume_id, text=text)

    return {"resume_id": resume_id, "preview": text[:1000]}


@app.post("/api/resumes/analyze")
async def analyze_resume(req: AnalyzeRequest):
    if req.resume_id not in vector_store.documents:
        raise HTTPException(status_code=404, detail="Resume not found")

    result = analyze_resume_with_rag(
        resume_id=req.resume_id,
        job_description=req.job_description,
        vector_store=vector_store,
        llm=llm_client,
    )
    return result


@app.get("/health")
async def health():
    return {"status": "ok"}
