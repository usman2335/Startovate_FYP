import React, { useState } from "react";
import "../../../CSS/Template2.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template2 = () => {
  const handleInput = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="template-container">
      <p className="template-description">
        <strong>Incident, event or condition</strong> causing and characterizing
        the real-world practical problem.
      </p>

      <div className="template-form">
        <div className="template-column">
          <label className="template-label">
            <strong> Enter Incident, event, or condition here.</strong>
          </label>
          <TextField
            id="outlined-textarea"
            // label="Incident, event, or condition"
            placeholder="Write text here"
            multiline
            sx={{ width: "100%", backgroundColor: "#fff" }}
          />
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
    </div>
  );
};

export default Template2;
