import React, { useState } from "react";
import "../CSS/Checklist.css"; // Import the CSS file
import Button from "./Button"; // Import the Button component

const Checklist = () => {
  return (
    <div className="container">
      <Button 
        label="← Go back" 
        onClick={() => {}} // Define your function for the button's onClick event
        padding="10px 20px"
        color="black"
        fontSize="16px"
        width="auto"
        marginTop="0"
        className="go-back-button" // Add a class for styling
      />

      <h2 className="title">
        LCI Checklist - I: <span className="highlight">Problem Identification</span>
      </h2>
      <p className="description">
        <strong>What</strong> real-world practical problem or unmet need will be solved or met by the proposed invention?
      </p>

      <div className="form-container">
        {[...Array(4)].map((_, index) => (
          <div className="row" key={index}>
            <div className="column">
              <label><strong>Why?</strong> Explore a root cause</label>
              <input type="text" />
            </div>
            <div className="column">
              <label><strong>References</strong></label>
              <input type="text" />
            </div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <Button 
          label="Reset"
          onClick={() => {}} // Define reset functionality
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
        <Button 
          label="Save"
          onClick={() => {}} // Define save functionality
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

export default Checklist;
