import React from "react";

const DEFAULT_ROWS = 10;

const Template13 = ({ answers, onInputChange }) => {
  const fieldNames = [
    "srNo",
    "referenceType",
    "title",
    "authorsInventors",
    "yearPublished",
    "journalPatentOffice",
    "doi",
    "relevanceToResearch",
  ];

  return (
    <div className="container" style={{ maxWidth: "98%", margin: "0 auto" }}>
      <div data-export-section="table">
        <h3 className="header" style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          Reference List of Research Articles and Patents
        </h3>
        <div className="table-wrapper" style={{ overflowX: "auto" }}>
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
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "4%"
                }}>
                  Sr.<br/>No.
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "10%"
                }}>
                  Type<br/>(Article/Patent)
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "20%"
                }}>
                  Title
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "15%"
                }}>
                  Authors/<br/>Inventors
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "7%"
                }}>
                  Year
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "15%"
                }}>
                  Journal/Conference/<br/>Patent Office
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "12%"
                }}>
                  DOI/<br/>Patent Number
                </th>
                <th style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  fontSize: "14px",
                  width: "17%"
                }}>
                  Relevance to<br/>Research
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(DEFAULT_ROWS)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {fieldNames.map((fieldName) => {
                    const fieldKey = `row_${rowIndex}_${fieldName}`;
                    const isTypeField = fieldName === "referenceType";
                    const isSrNo = fieldName === "srNo";
                    
                    return (
                      <td key={fieldName} style={{
                        border: "1px solid #000",
                        padding: "0"
                      }}>
                        {isSrNo ? (
                          <div style={{
                            width: "100%",
                            minHeight: "60px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f9fa"
                          }}>
                            {rowIndex + 1}
                          </div>
                        ) : isTypeField ? (
                          <select
                            className="input-box"
                            value={answers?.[fieldKey] || ""}
                            onChange={(e) => onInputChange(e, fieldKey)}
                            style={{
                              width: "100%",
                              minHeight: "60px",
                              padding: "10px",
                              border: "none",
                              outline: "none",
                              fontSize: "13px",
                              fontFamily: "inherit",
                              backgroundColor: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            <option value="">Select...</option>
                            <option value="Research Article">Research Article</option>
                            <option value="Patent">Patent</option>
                            <option value="Conference Paper">Conference Paper</option>
                            <option value="Book Chapter">Book Chapter</option>
                            <option value="Technical Report">Technical Report</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="input-box"
                            value={answers?.[fieldKey] || ""}
                            onChange={(e) => onInputChange(e, fieldKey)}
                            style={{
                              width: "100%",
                              minHeight: "60px",
                              padding: "10px",
                              border: "none",
                              outline: "none",
                              fontSize: "13px",
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

export default Template13;