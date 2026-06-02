import cohere
import pypdf
import io
import uuid
from pinecone import Pinecone
from config import settings

co = cohere.Client(api_key=settings.cohere_api_key)
pc = Pinecone(api_key=settings.pinecone_api_key)
index = pc.Index("bridge-ai-docs")




import re

def clean_text(text: str) -> str:
    # إصلاح المسافات الزائدة بين الحروف
    text = re.sub(r'(?<=[a-zA-Z]) (?=[a-zA-Z])', '', text)
    # إزالة المسافات المتعددة
    text = re.sub(r' +', ' ', text)
    return text.strip()


def extract_text(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        reader = pypdf.PdfReader(io.BytesIO(content))
        text = " ".join(page.extract_text() or "" for page in reader.pages)
    else:
        text = content.decode("utf-8")
    return clean_text(text)


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


def get_embeddings(texts: list, input_type: str) -> list:
    response = co.embed(
        texts=texts,
        model="embed-english-v3.0",
        input_type=input_type,
    )
    return response.embeddings


async def process_document(text: str, filename: str) -> str:
    doc_id = str(uuid.uuid4())
    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks, input_type="search_document")

    vectors = [
        {
            "id": f"{doc_id}_{i}",
            "values": emb,
            "metadata": {"doc_id": doc_id, "text": chunk, "filename": filename}
        }
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings))
    ]

    index.upsert(vectors=vectors)
    return doc_id


async def query_document(doc_id: str, question: str, top_k: int = 3) -> list:
    q_emb = get_embeddings([question], input_type="search_query")[0]

    results = index.query(
        vector=q_emb,
        top_k=top_k,
        filter={"doc_id": {"$eq": doc_id}},
        include_metadata=True,
    )

    return [
        {"text": match.metadata["text"], "score": match.score}
        for match in results.matches
    ]
