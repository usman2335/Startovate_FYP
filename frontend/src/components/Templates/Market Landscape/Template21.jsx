import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template21.css";

const Template21 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        Market Mapping and Competitive Landscape Matrix
      </div>

      {/* CAGR Input Section */}
      <div className="cagr-container">
        <span className="cagr-label">
          <strong>Compound Annual Growth Rate (CAGR)</strong>
        </span>
        <TextField
          id="cagr-input"
          variant="outlined"
          fullWidth
          className="bg-white"
          value={answers?.[`CAGR_`] || ""}
          onChange={(e) => onInputChange(e, `CAGR_`)}
        />
      </div>

      {/* Table Section */}
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Company Website</th>
            <th>Market Size Annual Revenue</th>
            <th>Customer Segment</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Auto-fills No. Column */}
              <td>
                <TextField
                  id="unique-textfield"
                  multiline
                  className="unique-textfield"
                />
              </td>
              <td>
                <TextField
                  id="unique-textfield"
                  multiline
                  className="unique-textfield"
                />
              </td>
              <td>
                <TextField
                  id="unique-textfield"
                  multiline
                  className="unique-textfield"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Template21;
