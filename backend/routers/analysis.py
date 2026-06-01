from fastapi import APIRouter, HTTPException
from models import AnalyzeDataRequest, DocumentRequest, AIResponse
from services import ai_service

router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.post("/data", response_model=AIResponse)
async def analyze_data(request: AnalyzeDataRequest):
    try:
        result = ai_service.analyze_data(request.data, request.question)
        return AIResponse(
            result=result["content"],
            model="llama-3.3-70b-versatile",
            processing_time=result["time"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/document", response_model=AIResponse)
async def process_document(request: DocumentRequest):
    valid_tasks = ["summarize", "analyze", "extract_entities", "translate"]
    if request.task not in valid_tasks:
        raise HTTPException(400, detail=f"task must be one of: {valid_tasks}")
    try:
        result = ai_service.process_document(
            request.text, request.task, request.target_language
        )
        return AIResponse(
            result=result["content"],
            model="llama-3.3-70b-versatile",
            processing_time=result["time"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
