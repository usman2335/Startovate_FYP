import React, { useState } from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template3 = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <p className="description" style={{ textAlign: "center" }}>
        <strong>Motivation and justification</strong> of the proposed invention for solving the real-world practical problem.
      </p>

      <div className="form-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>Enter Motivation and Justification</strong>
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

      <div className="button-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "20px" }}>
        <Button
          label="Reset"
          onClick={() => setInputValue("")}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
        />
        <Button
          label="Save"
          onClick={() => console.log("Saved Value:", inputValue)}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
        />
      </div>
    </div>
  );
};

export default Template3;
