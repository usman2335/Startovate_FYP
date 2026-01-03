import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template9.css";

const Template9 = ({ answers, onInputChange }) => {
  return (
    <div className="template9-container">
      {/* Column 1: Problem */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Problem</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={answers?.["problem_synonym1_"] || ""}
            onChange={(e) => onInputChange(e, "problem_synonym1_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={answers?.["problem_synonym2_"] || ""}
            onChange={(e) => onInputChange(e, "problem_synonym2_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={answers?.["problem_synonym3_"] || ""}
            onChange={(e) => onInputChange(e, "problem_synonym3_")}
          />
        </div>
      </div>

      {/* Column 2: Problem Solution */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Problem Solution</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={answers?.["solution_synonym1_"] || ""}
            onChange={(e) => onInputChange(e, "solution_synonym1_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={answers?.["solution_synonym2_"] || ""}
            onChange={(e) => onInputChange(e, "solution_synonym2_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={answers?.["solution_synonym3_"] || ""}
            onChange={(e) => onInputChange(e, "solution_synonym3_")}
          />
        </div>
      </div>

      {/* Column 3: Context of Application */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Context Of Application</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={answers?.["context_synonym1_"] || ""}
            onChange={(e) => onInputChange(e, "context_synonym1_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={answers?.["context_synonym2_"] || ""}
            onChange={(e) => onInputChange(e, "context_synonym2_")}
          />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={answers?.["context_synonym3_"] || ""}
            onChange={(e) => onInputChange(e, "context_synonym3_")}
          />
        </div>
      </div>
    </div>
  );
};

export default Template9;
