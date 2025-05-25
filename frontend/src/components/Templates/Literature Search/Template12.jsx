import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template12.css";

const Template12 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h4>
        Comparisons of Findings, similarities and differences in featues of
        exsisting researches
      </h4>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          multiline
          className="unique-textfield"
          placeholder="Enter text here..."
          value={answers?.[`comparison_`] || ""}
          onChange={(e) => onInputChange(e, `comparison_`)}
        />
      </div>
    </div>
  );
};

export default Template12;
