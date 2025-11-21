from typing import Dict

from .vectorstore import InMemoryVectorStore
from .llm import LLMClient


def analyze_resume_with_rag(
    resume_id: str,
    job_description: str,
    vector_store: InMemoryVectorStore,
    llm: LLMClient,
) -> Dict:
    # For now, we treat each resume as a single doc; RAG can be extended later.
    # We'll still do similarity search using the JD as query.
    results = vector_store.similarity_search(job_description, top_k=1)

    if not results:
        return {"error": "No resume data found in index"}

    _doc_id, resume_text, similarity = results[0]

    feedback = llm.generate_structured_feedback(
        context_chunks=[resume_text], job_description=job_description
    )

    # Simple scoring heuristics could be added here using keyword matching.
    return {
        "similarity": similarity,
        "llm_feedback": feedback,
        "resume_id": resume_id,
    }
