import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template21.css";

const Template21 = ({ answers, onInputChange }) => {
  return (
    <div className="container" data-export-section="main-section">
      {/* Header Section */}
      <h3 className="header">
        Market Mapping and Competitive Landscape Matrix
      </h3>

      {/* CAGR Input Section */}
      <div className="cagr-container" data-export-section="text">
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
      <div data-export-section="table">
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
                  value={answers?.[`value_${index}_0`] || ""}
                  onChange={(e) => onInputChange(e, `value_${index}_0`)}
                />
              </td>
              <td>
                <TextField
                  id="unique-textfield"
                  multiline
                  className="unique-textfield"
                  value={answers?.[`value_${index}_1`] || ""}
                  onChange={(e) => onInputChange(e, `value_${index}_1`)}
                />
              </td>
              <td>
                <TextField
                  id="unique-textfield"
                  multiline
                  className="unique-textfield"
                  value={answers?.[`value_${index}_2`] || ""}
                  onChange={(e) => onInputChange(e, `value_${index}_2`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Template21;
