import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template19.css";

const Template19 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h3>
        Justification behind how the proposed invention can meet the highlighted
        limitations of the existing solutions.
      </h3>
      <div className="unique-textfield-container" data-export-section="text">
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
