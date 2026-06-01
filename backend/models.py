from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    tokens_used: int

class AnalyzeDataRequest(BaseModel):
    data: dict
    question: str

class DocumentRequest(BaseModel):
    text: str
    task: str  # "summarize", "analyze", "extract_entities", "translate"
    target_language: Optional[str] = "Arabic"

class AIResponse(BaseModel):
    result: str
    model: str
    processing_time: float
