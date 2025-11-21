import numpy as np
from typing import Dict, List, Tuple

from .embedding import embed_text


class InMemoryVectorStore:
    def __init__(self, embedding_model):
        self.embedding_model = embedding_model
        self.documents: Dict[str, str] = {}
        self.embeddings: Dict[str, np.ndarray] = {}

    def add_document(self, doc_id: str, text: str):
        self.documents[doc_id] = text
        self.embeddings[doc_id] = embed_text(self.embedding_model, text)

    def similarity_search(
        self, query: str, top_k: int = 3
    ) -> List[Tuple[str, str, float]]:
        if not self.documents:
            return []

        query_emb = embed_text(self.embedding_model, query)
        results = []

        for doc_id, emb in self.embeddings.items():
            sim = self._cosine_similarity(query_emb, emb)
            results.append((doc_id, self.documents[doc_id], float(sim)))

        results.sort(key=lambda x: x[2], reverse=True)
        return results[:top_k]

    @staticmethod
    def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        denom = (np.linalg.norm(a) * np.linalg.norm(b)) or 1e-10
        return float(np.dot(a, b) / denom)
