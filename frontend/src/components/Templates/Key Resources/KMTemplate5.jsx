import React from "react";
import "../../../CSS/Template11.css";

const DEFAULT_ROWS = 8;

const KMTemplate5 = ({ answers, onInputChange }) => {
  const fieldNames = [
    "resourceRequired",
    "name",
    "institutionalAssociation",
    "contact",
    "expectedOutcome",
  ];

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div data-export-section="table">
        <h3 className="header">Networks and Alliances</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th rowSpan="2">Resources Required</th>
                <th colSpan="4">Networks and Alliances</th>
              </tr>
              <tr>
                <th>Name</th>
                <th>Institutional Association</th>
                <th>Contact</th>
                <th>Expected Outcome</th>
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

export default KMTemplate5;
