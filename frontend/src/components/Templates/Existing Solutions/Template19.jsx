import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template19.css";

const Template19 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h4>
        Justification behind how the proposed invention can meet the highlighted
        limitations of the existing solutions.
      </h4>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          multiline
          className="unique-textfield"
          value={answers?.[`justification_`] || ""}
          onChange={(e) => onInputChange(e, `justification_`)}
        />
      </div>
    </div>
  );
};

export default Template19;
