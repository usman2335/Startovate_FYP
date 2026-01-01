import React from "react";
import "../../../CSS/Template3.css";
import { TextField } from "@mui/material";

const KMTemplate1 = ({ answers, onInputChange }) => {
  // Number of input rows per section
  const numRows = 1;

  // Section configuration
  const sections = [
    { key: "tangible", label: "Tangible" },
    { key: "intangible", label: "Intangible" },
    { key: "available", label: "Available" },
    { key: "notAvailable", label: "Not Available" },
  ];

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div className="template-form" data-export-section="text">
        {/* Center Label */}
        <div className="center-label">
          <h2 className="template-title">Key Resources</h2>
        </div>

        {/* 2x2 Grid Container */}
        <div className="grid-container">
          {sections.map((section) => (
            <div key={section.key} className="grid-section">
              {/* Section Title */}
              <label>
                <strong>{section.label}</strong>
              </label>

              {/* Input Rows */}
              {[...Array(numRows)].map((_, index) => (
                <TextField
                  key={index}
                  placeholder="Enter Text here..."
                  multiline
                  fullWidth
                  variant="outlined"
                  value={answers?.[`${section.key}_${index}`] || ""}
                  onChange={(e) => onInputChange(e, `${section.key}_${index}`)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KMTemplate1;
