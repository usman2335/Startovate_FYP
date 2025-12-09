import React from "react";
import { TextField } from "@mui/material";

const Template8 = ({ answers, onInputChange }) => {
  return (
    <div className="w-3/4 mx-auto">
      <h3 className="description">
        <strong>Code of relevant industry</strong> available at Standard
        Industry
      </h3>

      <div
        className="template-form"
        style={{ marginTop: "20px" }}
        data-export-section="text"
      >
        <div className="column">
          <label>
            <strong>Enter Code of Relevant Industry</strong>
          </label>
          <TextField
            placeholder="Enter text here..."
            multiline
            fullWidth
            variant="outlined"
            value={answers?.[`code_`] || ""}
            onChange={(e) => onInputChange(e, `code_`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Template8;
