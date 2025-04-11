import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template15.css";

const Template15 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h4>
        Exploration of similar problems and solutions beyond the single industry
      </h4>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Analysis Here..."
          multiline
          className="unique-textfield"
          value={answers?.[`similarProblems`] || ""}
          onChange={(e) => onInputChange(e, `similarProblems`)}
        />
      </div>
    </div>
  );
};

export default Template15;
