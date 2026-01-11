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
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td> {/* Auto-fills No. Column */}
                <td>
                  <TextField
                    multiline
                    className="unique-textfield"
                    placeholder="Enter company name..."
                    value={answers?.[`company_name_${rowIndex}`] || ""}
                    onChange={(e) => onInputChange(e, `company_name_${rowIndex}`)}
                  />
                </td>
                <td>
                  <TextField
                    multiline
                    className="unique-textfield"
                    placeholder="Enter website, brochures, etc..."
                    value={answers?.[`company_resources_${rowIndex}`] || ""}
                    onChange={(e) => onInputChange(e, `company_resources_${rowIndex}`)}
                  />
                </td>
                <td>
                  <TextField
                    multiline
                    className="unique-textfield"
                    placeholder="Enter market size and revenue..."
                    value={answers?.[`market_size_${rowIndex}`] || ""}
                    onChange={(e) => onInputChange(e, `market_size_${rowIndex}`)}
                  />
                </td>
                <td>
                  <TextField
                    multiline
                    className="unique-textfield"
                    placeholder="Enter customer segment..."
                    value={answers?.[`customer_segment_${rowIndex}`] || ""}
                    onChange={(e) => onInputChange(e, `customer_segment_${rowIndex}`)}
                  />
                </td>
                <td>
                  <TextField
                    multiline
                    className="unique-textfield"
                    placeholder="Enter SWOT and PEST analysis..."
                    value={answers?.[`swot_pest_${rowIndex}`] || ""}
                    onChange={(e) => onInputChange(e, `swot_pest_${rowIndex}`)}
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
