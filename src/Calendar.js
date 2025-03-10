import React from "react";
import "./Calendar.css";

function Calendar() {
  const messages = JSON.parse(localStorage.getItem("mananMessages") || "[]");
  const dates = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="calendar-container">
      <h2>Progress Calendar</h2>
      <ul>
        {Object.entries(dates).map(([date, count]) => (
          <li key={date}>{date}: {count} message{count > 1 ? "s" : ""}</li>
        ))}
      </ul>
    </div>
  );
}

export default Calendar;
