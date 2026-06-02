# BridgeAI

A production-ready REST API that adds AI capabilities to any existing application — conversational AI, document Q&A, and data analysis — via simple HTTP calls.

**Live Demo:** https://bridge-ai-ten.vercel.app  
**API Docs:** https://bridge-ai-s7jr.onrender.com/docs

## What It Does

| Feature | Description |
|---------|-------------|
| Conversational AI | Session-aware chat with memory across turns |
| Document Q&A (RAG) | Upload a PDF or TXT file and ask questions about it |
| Data Analysis | Send JSON data and receive AI-powered insights |
| Document Processing | Summarize, translate, extract entities, or analyze any document |

## How to Integrate

```javascript
// Add AI chat to your app in 3 lines
const response = await fetch('https://bridge-ai-s7jr.onrender.com/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello', session_id: 'user-123' })
});
```

## Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Framework | FastAPI (Python) |
| AI | OpenAI GPT + Cohere |
| RAG Pipeline | LangChain + FAISS |
| Database | SQLite |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React (Vite) |
| Styling | CSS Modules |
| Deployment | Vercel |

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env    # Add API keys
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Reference

Full interactive API documentation available at `/docs` (Swagger UI) once the backend is running.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat` | POST | Send a message, get a response |
| `/rag/upload` | POST | Upload a document for Q&A |
| `/rag/query` | POST | Query an uploaded document |
| `/analysis` | POST | Analyze JSON data |

## Deployment

- **Backend:** Render (free tier)
- **Frontend:** Vercel

## License

MIT License