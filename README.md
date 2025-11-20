# Resume Analyzer AI

Resume Analyzer AI is a web app that lets users upload résumé PDFs and analyze them against a job description using an AI-powered RAG (Retrieval-Augmented Generation) pipeline.

It extracts text from the résumé, embeds it into a vector store, and uses an LLM to generate recruiter-style feedback:
- Key strengths
- Missing skills
- Match summary and a similarity score

---

## Tech Stack

**Backend**

- FastAPI (Python)
- sentence-transformers (for embeddings)
- In-memory vector store (cosine similarity)
- PDF parsing with pdfplumber
- LLM client (pluggable, e.g. OpenAI)

**Frontend**

- React (TypeScript)
- Axios for API calls
- Vite for bundling/dev server

---

## Features

- Upload résumé as PDF
- Extract and preview parsed text
- Paste a job description
- RAG-based retrieval of relevant context
- LLM-generated recruiter-style analysis
- Similarity score between résumé and job description

---

## Architecture

```text
[React Frontend]
     |
     v
[FastAPI Backend] --- PDF parsing (pdfplumber)
     |
     +-- Embeddings (sentence-transformers)
     |
     +-- InMemoryVectorStore (RAG)
     |
     +-- LLM Client (e.g. OpenAI, pluggable)
