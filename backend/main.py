from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, analysis, rag

app = FastAPI(
    title="BridgeAI - AI Integration API",
    description="Production-ready API for integrating AI into any application.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(analysis.router)
app.include_router(rag.router)


@app.get("/", tags=["Health"])
async def root():
    return {"project": "BridgeAI", "status": "running", "docs": "/docs"}
