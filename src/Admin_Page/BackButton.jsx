// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom"

import "./Admin.css";
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="freeze-btn" // You can style it differently if you want
      onClick={() => navigate(-1)}
      style={{ marginBottom: "15px" }}
    >
      ← Back
    </button>
  );
};

export default BackButton;