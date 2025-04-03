import React from "react";
import "../../../CSS/Template2.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template2 = () => {
  return (
    <div
      className="template-container"
      style={{ maxWidth: "90%", margin: "0 auto" }}
    >
      <p className="template-description">
        <strong>Incident, event or condition</strong> causing and characterizing
        the real-world practical problem.
      </p>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className="template-column" style={{ flex: "1" }}>
          <label className="template-label">
            <strong> Enter Incident, event, or condition here.</strong>
          </label>
          <TextField
            id="incident-textarea"
            placeholder="Write text here"
            multiline
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "#fff" }}
          />
        </div>

        <div className="template-column" style={{ flex: "1" }}>
          <label className="template-label">
            <strong>Feedback</strong>
          </label>
          <TextField
            id="feedback-textarea"
            placeholder="Write your feedback here..."
            multiline
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "#fff" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Template2;
