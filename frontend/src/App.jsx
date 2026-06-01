import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const tabs = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "data", label: "Data Analysis", icon: "📊" },
  { id: "document", label: "Document Analysis", icon: "📄" },
];

export default function App() {
  const [tab, setTab] = useState("chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="text-xl font-bold">AI Integration Hub</h1>
            <p className="text-xs text-slate-400">Powered by Groq + LLaMA 3.3</p>
          </div>
          <span className="ml-auto text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
            ● Connected
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
                ${tab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          {tab === "chat" && <ChatTab />}
          {tab === "data" && <DataTab />}
          {tab === "document" && <DocumentTab />}
        </div>
      </div>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat/`, { message: input, session_id: sessionId });
      setSessionId(res.data.session_id);
      setMessages((m) => [...m, { role: "ai", text: res.data.response }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-72 max-h-96 overflow-y-auto flex flex-col gap-3 p-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-72 text-slate-500 gap-2">
            <span className="text-4xl">💬</span>
            <p>Start a conversation...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
              ${m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-white/10 text-slate-100 rounded-bl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm text-slate-400 text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 placeholder-slate-500" />
        <button onClick={send} disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-xl text-sm font-medium transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}

function DataTab() {
  const [data, setData] = useState('{\n  "employees": 150,\n  "resigned": 18,\n  "avg_salary": 9000\n}');
  const [question, setQuestion] = useState("What is the employee turnover rate?");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze/data`, { data: JSON.parse(data), question });
      setResult(res.data.result);
    } catch {
      setResult("Error — make sure the data is valid JSON.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Data (JSON)</label>
        <textarea value={data} onChange={(e) => setData(e.target.value)} rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-blue-500 resize-none" />
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" />
      </div>
      <button onClick={analyze} disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-xl text-sm font-medium transition-colors">
        {loading ? "Analyzing..." : "📊 Analyze Data"}
      </button>
      {result && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
          {result}
        </div>
      )}
    </div>
  );
}

function DocumentTab() {
  const [text, setText] = useState("");
  const [task, setTask] = useState("summarize");
  const [lang, setLang] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const taskOptions = [
    { value: "summarize", label: "📝 Summarize" },
    { value: "analyze", label: "🔍 Analyze" },
    { value: "extract_entities", label: "🏷️ Extract Entities" },
    { value: "translate", label: "🌐 Translate" },
  ];

  const process = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze/document`, { text, task, target_language: lang });
      setResult(res.data.result);
    } catch {
      setResult("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5}
          placeholder="Enter your text here..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none placeholder-slate-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Task</label>
          <select value={task} onChange={(e) => setTask(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            {taskOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {task === "translate" && (
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Language</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500">
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="French">French</option>
            </select>
          </div>
        )}
      </div>
      <button onClick={process} disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-xl text-sm font-medium transition-colors">
        {loading ? "Processing..." : "Process Text"}
      </button>
      {result && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
          {result}
        </div>
      )}
    </div>
  );
}
