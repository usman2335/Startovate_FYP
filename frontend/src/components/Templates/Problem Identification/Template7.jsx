import React from "react";
import "../../../CSS/Template7.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template7 = ({ answers, onInputChange }) => {
  return (
    <div className="">
      <div className="heading-section">
        <h3 className="description">
          <strong>
            Supportive Associations/ Foundations/ Standards/ Regulations
          </strong>{" "}
          e.g., Food and Drug Administration, Federal Communications Commission,
          Federal Energy Regulatory Commission, Federal Trade Commission, IEEE
          Standards Committees etc.
        </h3>
      </div>

      <div className="content-section">
        <div className="form-container" data-export-section="text">
          <div className="column">
            <label>
              <strong>Enter details</strong>
            </label>
            <TextField
              placeholder="Enter text here..."
              multiline
              fullWidth
              variant="outlined"
              minRows={3}
              value={answers?.[`committees_`] || ""}
              onChange={(e) => onInputChange(e, `committees_`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template7;
