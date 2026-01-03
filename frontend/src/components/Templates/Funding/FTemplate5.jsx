import React from "react";
import "../../../CSS/Template3.css";
import { TextField } from "@mui/material";

const TRL_LEVELS = [
  "Basic Principles",
  "Technology Concept",
  "Proof of Concept",
  "Laboratory Validation",
  "Model Demonstration",
  "Functional Prototype",
  "Test Qualified",
  "Commercial Evaluation",
];

const FTemplate5 = ({ answers, onInputChange }) => {
  return (
    <div className="container" style={{ maxWidth: "95%", margin: "0 auto" }}>
      <div className="template-form" data-export-section="table">
        {/* Center Label */}
        <div className="center-label">
          <h2 className="template-title">
            Funding with respect to Technology Readiness Level (TRL)
          </h2>
        </div>

        {/* Table */}
        <table
          className="template-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  width: "30%",
                }}
              >
                TRL Stage
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  width: "25%",
                }}
              >
                Budget ($)
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  width: "45%",
                }}
              >
                Potential Funding Source
              </th>
            </tr>
          </thead>
          <tbody>
            {TRL_LEVELS.map((level, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    fontWeight: "500",
                  }}
                >
                  {level}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                  <TextField
                    type="number"
                    placeholder="Enter budget..."
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={answers?.[`trl_${index}_budget`] || ""}
                    onChange={(e) => onInputChange(e, `trl_${index}_budget`)}
                  />
                </td>
                <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                  <TextField
                    placeholder="Enter funding source..."
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={answers?.[`trl_${index}_fundingSource`] || ""}
                    onChange={(e) =>
                      onInputChange(e, `trl_${index}_fundingSource`)
                    }
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

export default FTemplate5;
