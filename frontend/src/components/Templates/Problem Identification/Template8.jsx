import React, { useState } from "react";
import { TextField } from "@mui/material";
import Button from "../../Button";

const Template8 = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container">
      <p className="description">
        <strong>Code of relevant industry</strong> available at Standard Industry
      </p>

      <div className="form-container">
        <div className="column">
          <label>
            <strong>Enter Code of Relevant Industry</strong>
          </label>
          <TextField
            placeholder="Enter text here..."
            multiline
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="button-group">
        <Button
          label="Reset"
          onClick={() => setInputValue("")}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
        <Button
          label="Save"
          onClick={() => console.log("Saved Value:", inputValue)}
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

export default Template8;