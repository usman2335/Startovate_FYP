import React, { useState } from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";

const Template3 = () => {
  const handleInput = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="container">
      <p className="description">
        <strong>Motivation and justification</strong> of the proposed invention for solving the real-world practical problem.
      </p>

      <div className="form-container">
        <div className="column">
          <label>
            <strong>Enter Motivation and Justification</strong>
          </label>
          <textarea rows="5" placeholder="Enter text here..." onInput={handleInput}></textarea>
        </div>
      </div>

      <div className="button-group">
        <Button
          label="Reset"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
        <Button
          label="Save"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
      </div>
    </div>
  );
};

export default Template3;