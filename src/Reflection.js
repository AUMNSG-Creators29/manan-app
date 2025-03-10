import React from "react";
import { useLocation } from "react-router-dom";
import "./Reflection.css";

function Reflection() {
  const location = useLocation();
  const { reflection } = location.state || { reflection: "No reflection available" };

  return (
    <div className="reflection-container">
      <h2>Reflection</h2>
      <p>{reflection}</p>
    </div>
  );
}

export default Reflection;
