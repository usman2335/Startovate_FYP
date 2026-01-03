import React from "react";

const DEFAULT_ROWS = 4;

const TCTemplate3 = ({ answers, onInputChange }) => {
  const fieldNames = [
    "deliverable",
    "thinkingOriented",
    "actionOriented",
    "peopleOriented",
  ];

  return (
    <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div data-export-section="table">
        <h3 className="header" style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          Skills and Capacities Required in Team Members
        </h3>
        <div className="table-wrapper">
          <table className="table" style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #000"
          }}>
            <thead>
              <tr>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "left",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "18px",
                  width: "25%"
                }}>
                  Key Deliverables
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>
                  Thinking Oriented<br />Tasks
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>
                  Action Oriented<br />Tasks
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>
                  People Oriented<br />Tasks
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(DEFAULT_ROWS)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {fieldNames.map((fieldName) => {
                    const fieldKey = `row_${rowIndex}_${fieldName}`;
                    return (
                      <td key={fieldName} style={{
                        border: "1px solid #000",
                        padding: "0"
                      }}>
                        <input
                          type="text"
                          className="input-box"
                          value={answers?.[fieldKey] || ""}
                          onChange={(e) => onInputChange(e, fieldKey)}
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "10px",
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            resize: "none",
                            backgroundColor: rowIndex === 0 ? "#f5f5f5" : "#fff"
                          }}
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

export default TCTemplate3;