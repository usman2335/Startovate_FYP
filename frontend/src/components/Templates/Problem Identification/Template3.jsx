import React, { useState } from "react";
import "../../../CSS/Template3.css";

import { TextField } from "@mui/material";

const Template3 = ({ answers, onInputChange }) => {
  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <p className="description" style={{ textAlign: "center" }}>
        <strong>Motivation and justification</strong> of the proposed invention
        for solving the real-world practical problem.
      </p>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>Enter Motivation and Justification</strong>
          </label>
          <TextField
            placeholder="Enter text here..."
            multiline
            fullWidth
            variant="outlined"
            minRows={2}
            sx={{ backgroundColor: "#fff" }}
            value={answers?.[`motivation_`] || ""}
            onChange={(e) => onInputChange(e, `motivation_`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Template3;
