import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template29.css";

const Template29 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h3 className="header">
        Discussions on whether proposed invention claims for similarities with
        other inventors' work or offers a critique that led to the novelty
        feature(s)
      </h3>
      <div className="unique-textfield-container" data-export-section="text">
        <TextField
          id="unique-textfield"
          placeholder="Enter Here ..."
          multiline
          className="unique-textfield"
          value={answers?.[`discussions_`] || ""}
          onChange={(e) => onInputChange(e, `discussions_`)}
        />
      </div>
    </div>
  );
};

export default Template29;
