import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API}/rag/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocId(res.data.doc_id);
      setDocName(file.name);
      setMessages((m) => [...m, {
        role: "system",
        text: `📄 **${file.name}** uploaded. You can now ask questions about it.`,
      }]);
    } catch {
      setMessages((m) => [...m, { role: "system", text: "❌ Failed to upload file." }]);
    }
    setUploading(false);
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      let response;

      if (docId) {
        // RAG mode
        const res = await axios.post(`${API}/rag/query`, {
          doc_id: docId,
          question: userMsg,
        });
        response = res.data.answer;
      } else {
        // Normal chat mode
        const res = await axios.post(`${API}/chat/`, {
          message: userMsg,
          session_id: sessionId,
        });
        setSessionId(res.data.session_id);
        response = res.data.response;
      }

      setMessages((m) => [...m, { role: "ai", text: response }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const clearDoc = () => {
    setDocId(null);
    setDocName(null);
    setMessages((m) => [...m, { role: "system", text: "📄 Document removed. Back to normal chat." }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h1 className="text-lg font-bold">BridgeAI</h1>
          <p className="text-xs text-slate-400">Powered by Groq + LLaMA 3.3</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {docName && (
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs">
              <span>📄 {docName}</span>
              <button onClick={clearDoc} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
            ● Online
          </span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-slate-500">
            <span className="text-6xl">🤖</span>
            <div>
              <p className="text-lg font-medium text-slate-400">How can I help you today?</p>
              <p className="text-sm mt-1">Chat with me or upload a document to ask questions about it</p>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {["Explain AI agents", "Analyze some data", "Upload a document"].map((s) => (
                <button key={s} onClick={() => setInput(s)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "system" ? (
              <div className="text-xs text-slate-500 bg-white/5 px-4 py-2 rounded-full mx-auto">
                {m.text}
              </div>
            ) : (
              <div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                  ${m.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
                  {m.role === "user" ? "U" : "🤖"}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white/10 text-slate-100 rounded-tl-sm"}`}>
                  {m.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">🤖</div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
          <input type="file" ref={fileRef} accept=".pdf,.txt"
            onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])}
            className="hidden" />
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors text-slate-400 hover:text-white"
            title="Upload document">
            {uploading ? "⏳" : "📎"}
          </button>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={docId ? `Ask about ${docName}...` : "Message BridgeAI..."}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 placeholder-slate-500" />
          <button onClick={send} disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
            ➤
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          {docId ? "📄 Document mode — answers based on your file" : "💬 Chat mode — general conversation"}
        </p>
      </div>
    </div>
  );
}
