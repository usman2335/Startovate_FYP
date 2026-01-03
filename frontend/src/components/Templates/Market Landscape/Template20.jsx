import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template20.css";

const Template20 = ({ answers, onInputChange }) => {
  return (
    <div className="container" data-export-section="main-section">
      {/* Header Section */}
      <h3 className="header">
        Market Mapping and Competitive Landscape Matrix
      </h3>

      {/* CAGR Input Section */}
      <div className="cagr-container" data-export-section="text">
        <span className="cagr-label">
          <strong>Compound Annual Growth Rate (CAGR):</strong>
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
              <th>Company Name</th>
              <th>
                Company Website, Brochures and Fliers, Blog, Video, Webinar
              </th>
              <th>Market Size Annual Revenue</th>
              <th>Customer Segment</th>
              <th>SWOT and PEST</th>
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
                    value={answers?.[`value_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `value_${index}`)}
                  />
                </td>
                <td>
                  <TextField
                    id="unique-textfield"
                    multiline
                    className="unique-textfield"
                    value={answers?.[`value_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `value_${index}`)}
                  />
                </td>
                <td>
                  <TextField
                    id="unique-textfield"
                    multiline
                    className="unique-textfield"
                    value={answers?.[`value_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `value_${index}`)}
                  />
                </td>
                <td>
                  <TextField
                    id="unique-textfield"
                    multiline
                    className="unique-textfield"
                    value={answers?.[`value_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `value_${index}`)}
                  />
                </td>
                <td>
                  <TextField
                    id="unique-textfield"
                    multiline
                    className="unique-textfield"
                    value={answers?.[`value_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `value_${index}`)}
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

export default Template20;
