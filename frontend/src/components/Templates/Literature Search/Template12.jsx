import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template12.css";

const Template12 = () => {
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
        />
      </div>
    </div>
  );
};

export default Template12;
