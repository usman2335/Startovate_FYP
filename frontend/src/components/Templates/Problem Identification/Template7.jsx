import React, { useState } from "react";
import "../../../CSS/Template7.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template7 = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <p className="description" style={{ textAlign: "center" }}>
        <strong>
          Supportive Associations/ Foundations/ Standards/ Regulations
        </strong>{" "}
        e.g., Food and Drug Administration, Federal Communications Commission,
        Federal Energy Regulatory Commission, Federal Trade Commission, IEEE
        Standards Committees etc.
      </p>

      <div className="form-container" style={{ marginBottom: "20px" }}>
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>Enter details</strong>
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

export default Template7;
