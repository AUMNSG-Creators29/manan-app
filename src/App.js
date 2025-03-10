import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import MindMap from "./MindMap";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "manan-9fea8.firebaseapp.com",
  projectId: "manan-9fea8",
  storageBucket: "manan-9fea8.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const mananFunction = httpsCallable(functions, "manan");

function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mananMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [industry, setIndustry] = useState("Solopreneur/Tech");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [typing, setTyping] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("mananMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const getWordCount = (text) => text.split(/\s+/).filter(Boolean).length;

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMsg = { 
        id: Date.now(), 
        sender: "You", 
        text: inputValue, 
        timestamp: new Date().toLocaleTimeString(),
        wordCount: getWordCount(inputValue)
      };
      setMessages([...messages, userMsg]);
      setLoading(true);
      try {
        const result = await mananFunction({
          text: inputValue,
          metadata: { industry },
        });
        const mananMsg = { 
          id: Date.now() + 1, 
          sender: "Manan", 
          text: result.data.reflection, 
          timestamp: new Date().toLocaleTimeString(),
          wordCount: getWordCount(result.data.reflection)
        };
        setMessages((prev) => [...prev, mananMsg]);
      } catch (error) {
        const errorText = `Oops! Something went wrong: ${error.message}`;
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: "Manan", 
            text: errorText, 
            timestamp: new Date().toLocaleTimeString(),
            wordCount: getWordCount(errorText)
          },
        ]);
      }
      setLoading(false);
      setInputValue("");
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem("mananMessages");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Reflection copied to clipboard!");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    setMessages(messages.map((msg) =>
      msg.id === id
        ? { ...msg, text: editText, wordCount: getWordCount(editText) }
        : msg
    ));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const handleExport = () => {
    const chatText = messages
      .map((msg) => `${msg.sender} [${msg.timestamp}]: ${msg.text} (${msg.wordCount} words)`)
      .join("\n");
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manan_chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMindMap = (reflection) => {
    navigate("/mindmap", { state: { reflection } });
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`chat-container ${darkMode ? "dark" : ""}`}>
      <div className="chat-header">
        <h2>Manan: Reflective AI</h2>
        <span className="message-count">Messages: {messages.length}</span>
        <button className="dark-mode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="export-btn" onClick={handleExport}>
          Export Chat
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="search-input"
        />
      </div>
      <div className="chat-messages">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="message">
            {editingId === msg.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(msg.id)}>Save</button>
              </>
            ) : (
              <>
                <strong>{msg.sender}</strong> <span className="timestamp">[{msg.timestamp}]</span>: {msg.text}
                <span className="word-count">({msg.wordCount} words)</span>
                {msg.sender === "You" && (
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(msg.id, msg.text)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(msg.id)}
                >
                  Delete
                </button>
                {msg.sender === "Manan" && (
                  <>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(msg.text)}
                    >
                      Copy
                    </button>
                    <button
                      className="mindmap-btn"
                      onClick={() => handleMindMap(msg.text)}
                    >
                      Mind Map
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
        {loading && <div className="message loading">Manan: Thinking...</div>}
        {typing && !loading && <div className="message typing">You are typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="Solopreneur/Tech">Solopreneur/Tech</option>
          <option value="Retail">Retail</option>
          <option value="Finance">Finance</option>
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setTyping(true);
          }}
          placeholder="Type your thoughts..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Wait" : "Send"}
        </button>
        <button className="clear" onClick={handleClear}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/mindmap" element={<MindMap />} />
      </Routes>
    </Router>
  );
}

export default App;
