import React from "react";
import "../../../CSS/Template11.css";

const DEFAULT_ROWS = 8;

const KMTemplate3 = ({ answers, onInputChange }) => {
  const fieldNames = [
    "deliverable",
    "university",
    "industry",
    "innovationLab",
    "online",
    "purchaseFrom",
    "rentFrom",
  ];

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div data-export-section="table">
        <h3 className="header">Key Resources Required</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th rowSpan="2">Key Deliverables</th>
                <th colSpan="4">Available at</th>
                <th colSpan="2">Not – Available</th>
              </tr>
              <tr>
                <th>University</th>
                <th>Industry</th>
                <th>Innovation Lab</th>
                <th>Online</th>
                <th>Purchase from</th>
                <th>Rent from</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(DEFAULT_ROWS)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {fieldNames.map((fieldName) => {
                    const fieldKey = `row_${rowIndex}_${fieldName}`;
                    return (
                      <td key={fieldName}>
                        <input
                          type="text"
                          className="input-box"
                          value={answers?.[fieldKey] || ""}
                          onChange={(e) => onInputChange(e, fieldKey)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KMTemplate3;
