import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chat from "./Chat";
import Reflection from "./Reflection";
import MindMap from "./MindMap";
import Calendar from "./Calendar";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : ""}`}>
        <Routes>
          <Route path="/" element={<Chat />} />
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
