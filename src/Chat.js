import React from 'react';

function Chat({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  industry,
  setIndustry,
  loading,
  setLoading,
  typing,
  setTyping,
  editingId,
  setEditingId,
  editText,
  setEditText,
  messagesEndRef,
  searchQuery,
  setSearchQuery,
  showHistory,
  setShowHistory,
}) {
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newMessage = {
      id: Date.now(),
      sender: 'User',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      wordCount: inputValue.trim().split(/\s+/).length,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setTyping(true);
  };

  const handleEdit = (id) => {
    const message = messages.find((msg) => msg.id === id);
    setEditingId(id);
    setEditText(message.text);
  };

  const handleSaveEdit = () => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === editingId ? { ...msg, text: editText } : msg))
    );
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="chat-container">
      <h1>Chat with Manan</h1>
      <div className="controls">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
        />
        <label>
          <input
            type="checkbox"
            checked={showHistory}
            onChange={(e) => setShowHistory(e.target.checked)}
          />
          Show History
        </label>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="Solopreneur/Tech">Solopreneur/Tech</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
        </select>
      </div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {editingId === msg.id ? (
              <div>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                <p>{msg.text}</p>
                <span>{msg.timestamp}</span>
                <button onClick={() => handleEdit(msg.id)}>Edit</button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {typing && <p>Manan is typing...</p>}
    </div>
  );
}

export default Chat;
