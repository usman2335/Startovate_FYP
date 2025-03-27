import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template10.css";

const Template10 = () => {
  return (
    <div className="container">
      <h4>
        Research gap conceived through observations and discussions with
        stakeholders.
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

export default Template10;
