import React, { useState } from "react";
import "../../../CSS/Template2.1.css";
import Button from "../../Button";

const Template2 = () => {
  const handleInput = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="template-container">
      <p className="template-description">
        <strong>Incident, event or condition</strong> causing and characterizing the real-world practical problem.
      </p>

      <div className="template-form">
        <div className="template-column">
          <label className="template-label">
            <strong> Enter Incident, event, or condition here.</strong>
          </label>
          <textarea
            className="template-textarea"
            rows="3"
            placeholder="Enter text here..."
            onInput={handleInput}
          ></textarea>
        </div>
        <div className="template-column">
          <label className="template-label">
            <strong>Feedback</strong>
          </label>
          <textarea
            className="template-textarea"
            rows="3"
            placeholder="Write your feedback here..."
            onInput={handleInput}
          ></textarea>
        </div>
      </div>

      <div className="template-button-group">
        <Button
          label="Reset"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
        <Button
          label="Save"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
      </div>
    </div>
  );
};

export default Template2;
