from functools import lru_cache
from sentence_transformers import SentenceTransformer
import numpy as np


@lru_cache(maxsize=1)
def get_embedding_model():
    # Small, fast model – great for demos
    return SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(model: SentenceTransformer, text: str) -> np.ndarray:
    emb = model.encode([text], convert_to_numpy=True)[0]
    return emb
