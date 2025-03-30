import React, { useState } from "react";
import { TextField } from "@mui/material";

const Template8 = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container">
      <p className="description">
        <strong>Code of relevant industry</strong> available at Standard
        Industry
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
    </div>
  );
};

export default Template8;
