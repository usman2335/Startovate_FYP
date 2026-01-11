import React from "react";
import "../../../CSS/Template3.css";
import { TextField } from "@mui/material";

const DEFAULT_ROWS = 6;

const FTemplate2 = ({ answers, onInputChange }) => {
  const columns = [
    { key: "keyDeliverable", label: "Key Deliverable" },
    { key: "resource", label: "Resource / Equipment" },
    { key: "quantity", label: "Quantity" },
    { key: "cost", label: "Estimated Cost ($)" },
  ];

  return (
    <div className="container" style={{ maxWidth: "95%", margin: "0 auto" }}>
      <div className="template-form" data-export-section="table">
        {/* Center Label */}
        <div className="center-label">
          <h2 className="template-title">
            Tangible Resources & Equipment Budget
          </h2>
        </div>

        {/* Table */}
        <table
          className="template-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(DEFAULT_ROWS)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ border: "1px solid #ccc", padding: "5px" }}
                  >
                    <TextField
                      placeholder={`Enter ${col.label.toLowerCase()}...`}
                      fullWidth
                      variant="outlined"
                      size="small"
                      type={col.key === "cost" || col.key === "quantity" ? "number" : "text"}
                      value={answers?.[`row_${rowIndex}_${col.key}`] || ""}
                      onChange={(e) =>
                        onInputChange(e, `row_${rowIndex}_${col.key}`)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FTemplate2;
