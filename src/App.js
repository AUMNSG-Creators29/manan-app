import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: "You", text: inputValue }]);
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
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
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
