import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

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

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mananMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [industry, setIndustry] = useState("Solopreneur/Tech");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("mananMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMsg = { 
        sender: "You", 
        text: inputValue, 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages([...messages, userMsg]);
      setLoading(true);
      try {
        const result = await mananFunction({
          text: inputValue,
          metadata: { industry },
        });
        setMessages((prev) => [
          ...prev,
          { 
            sender: "Manan", 
            text: result.data.reflection, 
            timestamp: new Date().toLocaleTimeString() 
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { 
            sender: "Manan", 
            text: `Oops! Something went wrong: ${error.message}`, 
            timestamp: new Date().toLocaleTimeString() 
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

  return (
    <div className={`chat-container ${darkMode ? "dark" : ""}`}>
      <div className="chat-header">
        <h2>Manan: Reflective AI</h2>
        <span className="message-count">Messages: {messages.length}</span>
        <button className="dark-mode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}</strong> <span className="timestamp">[{msg.timestamp}]</span>: {msg.text}
            {msg.sender === "Manan" && (
              <button
                className="copy-btn"
                onClick={() => handleCopy(msg.text)}
              >
                Copy
              </button>
            )}
          </div>
        ))}
        {loading && <div className="message loading">Manan: Thinking...</div>}
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
          onChange={(e) => setInputValue(e.target.value)}
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

export default App;
