from fastapi import APIRouter, HTTPException
from models import ChatRequest, ChatResponse
from services.ai_service import chat
from database import get_db
import uuid

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    db = get_db()
    session_id = request.session_id or str(uuid.uuid4())

    # جلب تاريخ المحادثة من قاعدة البيانات
    history = []
    if request.session_id:
        session = await db.sessions.find_one({"session_id": session_id})
        if session:
            history = session.get("messages", [])

    history.append({"role": "user", "content": request.message})

    try:
        result = chat(history, system=request.system_prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    history.append({"role": "assistant", "content": result["content"]})

    # حفظ الجلسة المحدّثة
    await db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"session_id": session_id, "messages": history}},
        upsert=True,
    )

    return ChatResponse(
        response=result["content"],
        session_id=session_id,
        tokens_used=result["tokens"],
    )


@router.delete("/{session_id}")
async def clear_session(session_id: str):
    db = get_db()
    await db.sessions.delete_one({"session_id": session_id})
    return {"message": "Session cleared"}
