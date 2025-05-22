import React, { useState } from "react";
import "../../../CSS/Template5.css";

const StakeholderMatrix = () => {
  const [stakeholders, setStakeholders] = useState({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
  });

  const [inputs, setInputs] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleAddStakeholder = (quadrant) => {
    if (inputs[quadrant].trim() !== "") {
      setStakeholders((prev) => ({
        ...prev,
        [quadrant]: [...prev[quadrant], inputs[quadrant].trim()],
      }));
      setInputs((prev) => ({ ...prev, [quadrant]: "" }));
    }
  };

  const handleRemoveStakeholder = (quadrant, index) => {
    setStakeholders((prev) => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((_, i) => i !== index),
    }));
  };

  const renderQuadrant = (quadrantKey, title, className) => (
    <div className={`quadrant ${className}`}>
      <div className="quadrant-title">{title}</div>
      <div className="stakeholders">
        {stakeholders[quadrantKey].map((name, index) => (
          <div className="stakeholder-item" key={index}>
            <span>{name}</span>
            <button
              className="remove-btn"
              onClick={() => handleRemoveStakeholder(quadrantKey, index)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input-box"
          placeholder="Enter stakeholder"
          value={inputs[quadrantKey]}
          onChange={(e) =>
            setInputs({ ...inputs, [quadrantKey]: e.target.value })
          }
        />
        <button
          className="add-btn"
          onClick={() => handleAddStakeholder(quadrantKey)}
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="matrix-container">
      {renderQuadrant("q1", "High Interest, Low Influence", "q1")}
      {renderQuadrant("q2", "High Interest, High Influence", "q2")}
      {renderQuadrant("q3", "Low Interest, Low Influence", "q3")}
      {renderQuadrant("q4", "Low Interest, High Influence", "q4")}
    </div>
  );
};

export default StakeholderMatrix;
