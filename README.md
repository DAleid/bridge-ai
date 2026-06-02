# 🤖 BridgeAI — AI Integration API

A production-ready API that adds AI capabilities to any existing application via simple REST API calls.

**Live Demo:** https://bridge-ai-ten.vercel.app
**API Docs:** https://bridge-ai-s7jr.onrender.com/docs



## What it does

- 💬 **Conversational AI** with session memory
- 📄 **Document Q&A (RAG)** — upload a PDF/TXT and ask questions about it
- 📊 **Data Analysis** — send JSON data and get AI-powered insights
- 🔍 **Document Processing** — summarize, analyze, translate, extract entities

## How to integrate into your app

// Add AI chat to your existing app in 3 lines
const res = await fetch('https://bridge-ai-s7jr.onrender.com/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Hello!", company: "Your Company" })
})
const data = await res.json()
console.log(data.response)
Tech Stack
Layer	Technology
Backend	FastAPI (Python)
AI Model	Groq + LLaMA 3.3-70b
Embeddings	Cohere embed-english-v3.0
Vector DB	Pinecone
Database	MongoDB Atlas
Frontend	React + Tailwind CSS
Deployment	Render + Vercel
Architecture

User → React Frontend (Vercel)
           ↓
      FastAPI Backend (Render)
           ↓
   ┌───────┴────────┐
Groq API      Cohere API
(LLM)         (Embeddings)
                   ↓
              Pinecone DB
           (Vector Search)
API Endpoints
Method	Endpoint	Description
POST	/chat/	Chat with memory
DELETE	/chat/{session_id}	Clear session
POST	/analyze/data	Analyze JSON data
POST	/analyze/document	Process documents
POST	/rag/upload	Upload document for Q&A
POST	/rag/query	Ask questions about document
Local Setup

# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Add .env file
GROQ_API_KEY=your_key
MONGODB_URL=your_mongodb_url
COHERE_API_KEY=your_key
PINECONE_API_KEY=your_key
SECRET_KEY=your_secret

uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
Built by
Daniyah Al-Eid — AI Integration Engineer

GitHub: https://github.com/DAleid
LinkedIn: https://www.linkedin.com/in/daniyah-al-eid-6a9254244/
