import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template28.css";

const Template28 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h3 className="header">
        Mapping between identified problem and novelty feature(s) of proposed
        invention
      </h3>
      <div className="unique-textfield-container" data-export-section="text">
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
