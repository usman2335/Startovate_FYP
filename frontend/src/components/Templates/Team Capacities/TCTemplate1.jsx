import React from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template1 = ({ answers, onInputChange }) => {
  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <h3 className="description" style={{ textAlign: "center" }}>
        <strong>Team Configuration Template</strong>
      </h3>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        data-export-section="text"
      >
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>Configuration of team members e.g. Principal Investigator, Co-Investigator, students, collaborator, Industrial expert, end users etc.</strong>
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

export default Template1;
