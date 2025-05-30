import React, { useState } from "react";
import "../../../CSS/Template3.css";
import Button from "../../Button";
import { TextField } from "@mui/material";

const Template4 = ({ answers, onInputChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <p className="description" style={{ textAlign: "center" }}>
        <strong>LCI Template XXXIII</strong>
      </p>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className="column" style={{ width: "100%" }}>
          <label>
            <strong>
              Demonstration of orginality and relevancy with different
              theories/models.
            </strong>
          </label>
          <TextField
            placeholder="Enter Demonstration here..."
            multiline
            fullWidth
            variant="outlined"
            value={answers?.[`demonstration_`] || ""}
            onChange={(e) => onInputChange(e, `demonstration_`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Template4;
