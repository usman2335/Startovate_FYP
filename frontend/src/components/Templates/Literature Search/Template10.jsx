import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template10.css";

const Template10 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h4>
        Research gap conceived through observations and discussions with
        stakeholders.
      </h4>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          multiline
          className="unique-textfield"
          placeholder="Enter text here..."
          value={answers?.[`gap_`] || ""}
          onChange={(e) => onInputChange(e, `gap_`)}
        />
      </div>
    </div>
  );
};

export default Template10;
