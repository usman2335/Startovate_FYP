import React, { useState } from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template3 = ({ answers, onInputChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <p className="description" style={{ textAlign: "center" }}>
        <strong>LCI-Template XXXXXX</strong>
      </p>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>Expected outcome e.g., full design or 3D drawing, functional prototype and on-demand production etc.</strong>
          </label>
          <TextField
            placeholder="Enter Text here..."
            multiline
            fullWidth
            variant="outlined"
            value={answers?.[`objectives_`] || ""}
            onChange={(e) => onInputChange(e, `objectives_`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Template3;
