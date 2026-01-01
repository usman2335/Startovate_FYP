import React from "react";
import "../../../CSS/Template3.css";
import { TextField } from "@mui/material";

const FTemplate1 = ({ answers, onInputChange }) => {
  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div className="template-form" data-export-section="text">
        {/* Center Label */}
        <div className="center-label">
          <h2 className="template-title">
            Total Grant Desired for Research Process
          </h2>
        </div>

        {/* Form Fields */}
        <div className="form-section">
          <label>
            <strong>Total Funding Required ($)</strong>
          </label>
          <TextField
            type="number"
            placeholder="Enter total funding amount..."
            fullWidth
            variant="outlined"
            value={answers?.amount || ""}
            onChange={(e) => onInputChange(e, "amount")}
          />
        </div>

        <div className="form-section" style={{ marginTop: "20px" }}>
          <label>
            <strong>Justification</strong>
          </label>
          <TextField
            placeholder="Provide justification for the requested funding..."
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={answers?.justification || ""}
            onChange={(e) => onInputChange(e, "justification")}
          />
        </div>
      </div>
    </div>
  );
};

export default FTemplate1;
