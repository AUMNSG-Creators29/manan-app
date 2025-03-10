import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Reflection from "./Reflection";
import MindMap from "./MindMap";
import Calendar from "./Calendar";
import "./App.css";

function ChatWrapper() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mananMessages");
    return saved ? JSON.parse(saved) : [
      { id: 0, sender: "Manan", text: "Welcome! I’m Manan, your reflective AI. Type your thoughts to get started.", timestamp: new Date().toLocaleTimeString(), wordCount: 14 }
    ];
  });
  const [inputValue, setInputValue] = useState("");
  const [industry, setIndustry] = useState("Solopreneur/Tech");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(true);
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

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Chat
      messages={showHistory ? filteredMessages : []}
      setMessages={setMessages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      industry={industry}
      setIndustry={setIndustry}
      loading={loading}
      setLoading={setLoading}
      typing={typing}
      setTyping={setTyping}
      editingId={editingId}
      setEditingId={setEditingId}
      editText={editText}
      setEditText={setEditText}
      messagesEndRef={messagesEndRef}
      navigate={navigate}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showHistory={showHistory}
      setShowHistory={setShowHistory}
    />
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : ""}`}>
        <Routes>
          <Route path="/" element={<ChatWrapper />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
        <nav className="bottom-nav">
          <Link to="/" className="nav-item">Chat</Link>
          <Link to="/reflection" className="nav-item">Reflection</Link>
          <Link to="/mindmap" className="nav-item">Mind Map</Link>
          <Link to="/calendar" className="nav-item">Calendar</Link>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        </nav>
        {menuOpen && (
          <div className="menu">
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
            <Link to="/payments" onClick={() => setMenuOpen(false)}>Payments</Link>
            <Link to="/help" onClick={() => setMenuOpen(false)}>Help</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <button onClick={toggleDarkMode}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
