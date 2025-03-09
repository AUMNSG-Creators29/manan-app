import React, { useState } from "react";
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
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMsg = { sender: "You", text: inputValue };
      setMessages([...messages, userMsg]);
      try {
        const result = await mananFunction({
          text: inputValue,
          metadata: { industry: "Solopreneur/Tech" }, // Hardcoded for now
        });
        setMessages((prev) => [
          ...prev,
          { sender: "Manan", text: result.data.reflection },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: "Manan", text: "Error: Couldn’t get reflection." },
        ]);
      }
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Manan: Reflective AI</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your thoughts..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from "react";
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
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [industry, setIndustry] = useState("Solopreneur/Tech");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMsg = { sender: "You", text: inputValue };
      setMessages([...messages, userMsg]);
      setLoading(true);
      try {
        const result = await mananFunction({
          text: inputValue,
          metadata: { industry },
        });
        setMessages((prev) => [
          ...prev,
          { sender: "Manan", text: result.data.reflection },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: "Manan", text: `Oops! Something went wrong: ${error.message}` },
        ]);
      }
      setLoading(false);
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Manan: Reflective AI</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && <div className="message">Manan: Thinking...</div>}
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
      </div>
    </div>
  );
}

export default App;
