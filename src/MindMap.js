import React from "react";
import { useLocation } from "react-router-dom";
import "./MindMap.css";

function MindMap() {
  const location = useLocation();
  const { reflection } = location.state || { reflection: "No mind map data provided" };

  return (
    <div className="mindmap-container">
      <h2>Mind Map</h2>
      <pre className="mindmap">{reflection}</pre>
    </div>
  );
}

export default MindMap;
