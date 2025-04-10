import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template22.css";

const Template22 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          Evidence from news, reports and articles showing chance of potential
          growth or decline of the industry hosting the existing solutions in
          the market (e.g., CAGR)
        </h4>
      </div>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Evidence..."
          multiline
          className="unique-textfield"
          value={answers?.[`evidence_`] || ""}
          onChange={(e) => onInputChange(e, `evidence_`)}
        />
      </div>
    </div>
  );
};

export default Template22;
