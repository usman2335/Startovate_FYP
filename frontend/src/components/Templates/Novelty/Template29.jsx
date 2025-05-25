import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template29.css";

const Template29 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          Discussions on whether proposed invention claims for similarities with
          other inventors’ work or offers a critique that led to the novelty
          feature(s)
        </h4>
      </div>
      <div className="unique-textfield-container">
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
