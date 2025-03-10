import React from "react";
import { useLocation } from "react-router-dom";
import "./MindMap.css";

function MindMap() {
  const location = useLocation();
  const { reflection } = location.state || { reflection: "No reflection provided" };

  const generateMindMap = (text) => {
    const lines = text.split(". ").map((line) => line.trim());
    return lines.map((line, index) => `${"  ".repeat(index % 3)}• ${line}`).join("\n");
  };

  return (
    <div className="mindmap-container">
      <h2>Mind Map</h2>
      <pre className="mindmap">{generateMindMap(reflection)}</pre>
    </div>
  );
}

export default MindMap;
