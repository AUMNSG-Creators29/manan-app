import React from "react";
import "./Chat.css";

function Chat({
  messages, setMessages, inputValue, setInputValue, industry, setIndustry,
  loading, setLoading, typing, setTyping, editingId, setEditingId,
  editText, setEditText, messagesEndRef, navigate, searchQuery, setSearchQuery,
  showHistory, setShowHistory
}) {
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
      // Placeholder until Blaze: simulate DeepSeek response
      const response = await fetch("http://localhost:5001/manan-app/us-central1/manan", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue, metadata: { industry } })
      });
      const result = await response.json();
      const mananMsg = { 
        id: Date.now() + 1, 
        sender: "Manan", 
        text: result.reflection || "Simulated response: Great idea!", 
        timestamp: new Date().toLocaleTimeString(),
        wordCount: getWordCount(result.reflection || "Simulated response: Great idea!")
      };
      setMessages((prev) => [...prev, mananMsg]);
      navigate("/reflection", { state: { reflection: result.reflection || "Simulated response: Great idea!" } });
    } catch (error) {
      const errorText = `Oops! Something went wrong: ${error.message}`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "Manan", text: errorText, timestamp: new Date().toLocaleTimeString(), wordCount: getWordCount(errorText) },
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

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    setMessages(messages.map((msg) =>
      msg.id === id ? { ...msg, text: editText, wordCount: getWordCount(editText) } : msg
    ));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const handleMindMap = (reflection) => {
    navigate("/mindmap", { state: { reflection } });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src="https://via.placeholder.com/40?text=M" alt="Manan Logo" className="company-logo" />
        <h2>Manan Chat</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="search-input"
        />
        <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            {editingId === msg.id ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => handleSaveEdit(msg.id)}>Save</button>
              </>
            ) : (
              <>
                <strong>{msg.sender}</strong> <span className="timestamp">[{msg.timestamp}]</span>: {msg.text}
                <span className="word-count">({msg.wordCount} words)</span>
                {msg.sender === "You" && (
                  <button className="edit-btn" onClick={() => handleEdit(msg.id, msg.text)}>Edit</button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(msg.id)}>Delete</button>
                {msg.sender === "Manan" && (
                  <>
                    <button className="copy-btn" onClick={() => handleCopy(msg.text)}>Copy</button>
                    <button className="mindmap-btn" onClick={() => handleMindMap(msg.text)}>Mind Map</button>
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
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="Solopreneur/Tech">Solopreneur/Tech</option>
          <option value="Retail">Retail</option>
          <option value="Finance">Finance</option>
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setTyping(true); }}
          placeholder="Type your thoughts..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>{loading ? "Wait" : "Send"}</button>
        <button className="clear" onClick={handleClear}>Clear Chat</button>
      </div>
    </div>
  );
}

export default Chat;
