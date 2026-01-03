import React from "react";

const DEFAULT_ROWS = 6;

const TCTemplate4 = ({ answers, onInputChange }) => {
  const fieldNames = [
    "deliverable",
    "requiredSkills",
    "presenceStatus",
    "teamMemberName",
    "absenceReason",
    "actionPlan",
  ];

  return (
    <div className="container" style={{ maxWidth: "95%", margin: "0 auto" }}>
      <div data-export-section="table">
        <h3 className="header" style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          Presence or Absence of Skills and Capacities in Team Members
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
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "18%"
                }}>
                  Key Deliverable
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "20%"
                }}>
                  Required Skills & Capacities
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "12%"
                }}>
                  Status<br/>(Present/Absent)
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "18%"
                }}>
                  Team Member Name<br/>(if Present)
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "15%"
                }}>
                  Reason for Absence
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "17%"
                }}>
                  Action Plan<br/>(if Absent)
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(DEFAULT_ROWS)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {fieldNames.map((fieldName) => {
                    const fieldKey = `row_${rowIndex}_${fieldName}`;
                    const isStatusField = fieldName === "presenceStatus";
                    
                    return (
                      <td key={fieldName} style={{
                        border: "1px solid #000",
                        padding: "0"
                      }}>
                        {isStatusField ? (
                          <select
                            className="input-box"
                            value={answers?.[fieldKey] || ""}
                            onChange={(e) => onInputChange(e, fieldKey)}
                            style={{
                              width: "100%",
                              minHeight: "70px",
                              padding: "10px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              backgroundColor: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            <option value="">Select...</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Partially Available">Partially Available</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="input-box"
                            value={answers?.[fieldKey] || ""}
                            onChange={(e) => onInputChange(e, fieldKey)}
                            style={{
                              width: "100%",
                              minHeight: "70px",
                              padding: "10px",
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              resize: "none",
                              backgroundColor: "#fff"
                            }}
                          />
                        )}
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

export default TCTemplate4;