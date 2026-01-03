import React from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template4 = ({ answers, onInputChange }) => {
  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        data-export-section="text"
      >
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>
              Expected outcome e.g., publication in conference proceedings and
              research journals or applying for patent
            </strong>
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

export default Template4;
