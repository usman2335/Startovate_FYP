import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template23.css";

const Template23 = () => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          Identification of potential end-users who are ready to pay for the
          proposed invention
        </h4>
      </div>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Here ..."
          multiline
          className="unique-textfield"
        />
      </div>
    </div>
  );
};

export default Template23;
