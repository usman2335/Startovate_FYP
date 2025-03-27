import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template24.css";

const Template24 = () => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          Identification of similar inventions in the R&D pipeline, found during
          conferences and meetings with stakeholders.
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

export default Template24;
