from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, analysis

app = FastAPI(
    title="AI Integration API Hub",
    description="Professional API demonstrating Groq AI integration, "
                "data analysis, and conversational AI with memory.",
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


@app.get("/", tags=["Health"])
async def root():
    return {
        "project": "AI Integration API Hub",
        "status": "running",
        "docs": "/docs",
    }
