import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template19.css";

const Template19 = () => {
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
        />
      </div>
    </div>
  );
};

export default Template19;
