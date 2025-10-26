// src/app/components/PopupMessage.jsx
import React from "react";

export default function PopupMessage({ message, onClose }) {
  return (
    <div className="popup-backdrop">
      <div className="popup-message">
        <p>{message}</p>
        <button className="btn btn-accent" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}