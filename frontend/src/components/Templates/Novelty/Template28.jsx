import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template28.css";

const Template28 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          Mapping between identified problem and novelty feature(s) of proposed
          invention
        </h4>
      </div>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Here ..."
          multiline
          className="unique-textfield"
          value={answers?.[`mapping_`] || ""}
          onChange={(e) => onInputChange(e, `mapping_`)}
        />
      </div>
    </div>
  );
};

export default Template28;
