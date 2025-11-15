import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template26.css";
const Template26 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <div className="header">
        <h4>
          What is the Probability of Paying by the End-User for the New Solution
          to be Introduced in the Market meeting the Identified Limitations of
          the Existing Solutions?
        </h4>
      </div>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Here ..."
          multiline
          className="unique-textfield"
          value={answers?.[`probability_`] || ""}
          onChange={(e) => onInputChange(e, `probability_`)}
        />
      </div>
      <div className="header">
        <h4>
          Whether the End-User will Directly Pay for the New Solution, or it
          will be paid indirectly through other mode?
        </h4>
      </div>
      <div className="unique-textfield-container">
        <TextField
          id="unique-textfield"
          placeholder="Enter Here ..."
          multiline
          className="unique-textfield"
          value={answers?.[`pay_`] || ""}
          onChange={(e) => onInputChange(e, `pay_`)}
        />
      </div>
    </div>
  );
};

export default Template26;
