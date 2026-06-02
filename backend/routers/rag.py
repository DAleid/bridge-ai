from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from services import rag_service, ai_service

router = APIRouter(prefix="/rag", tags=["RAG"])


class QueryRequest(BaseModel):
    doc_id: str
    question: str


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = rag_service.extract_text(content, file.filename)

        if not text.strip():
            raise HTTPException(400, detail="Could not extract text from document")

        doc_id = await rag_service.process_document(text, file.filename)
        return {"doc_id": doc_id, "filename": file.filename, "status": "processed"}

    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.post("/query")
async def query_document(request: QueryRequest):
    try:
        chunks = await rag_service.query_document(request.doc_id, request.question)

        if not chunks:
            raise HTTPException(404, detail="No relevant content found")

        context = "\n\n".join([c["text"] for c in chunks])

        prompt = f"""Answer the question based ONLY on the context below.
If the answer is not found, say "I cannot find this in the document."

Context:
{context}

Question: {request.question}"""

        result = ai_service.chat([{"role": "user", "content": prompt}])

        return {
            "answer": result["content"],
            "sources": [c["text"][:200] + "..." for c in chunks],
            "processing_time": result["time"],
        }
    except Exception as e:
        raise HTTPException(500, detail=str(e))
