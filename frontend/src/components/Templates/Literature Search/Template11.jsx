import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template11.css";

const Template11 = ({ answers, onInputChange }) => {
  const articleHeaders = [
    "No.",
    "Title",
    "Journal/ Proceeding",
    "Author(s)",
    "Findings",
    "Research Gap",
  ];
  const patentHeaders = [
    "No.",
    "Title",
    "LPC",
    "Inventor(s)",
    "Assignee",
    "Claims",
  ];
  const numRows = 5;

  const renderTable = (headers, typePrefix) => (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(numRows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((_, colIndex) => {
              const key = `${typePrefix}_${rowIndex}_${colIndex}`;
              return (
                <td key={colIndex}>
                  <input
                    type="text"
                    className="input-box"
                    value={answers?.[key] || ""}
                    onChange={(e) => onInputChange(e, key)}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      {/* Article Matrix */}
      <div className="container">
        <div className="header">
          Article Matrix: Published Work in Research Journals and Conference
          Proceedings
        </div>
        <div className="search-container">
          <span className="search-label">Keywords:</span>
          <TextField
            id="outlined-search"
            type="search"
            fullWidth
            value={answers?.["keywords_"] || ""}
            onChange={(e) => onInputChange(e, "keywords_")}
          />
        </div>
        {renderTable(articleHeaders, "article")}
      </div>

      {/* Patent Matrix */}
      <div className="container">
        <div className="header">Patent Matrix</div>
        <div className="search-container">
          <span className="search-label">Keywords:</span>
          <TextField
            id="outlined-search"
            type="search"
            fullWidth
            value={answers?.["patent_keywords_"] || ""}
            onChange={(e) => onInputChange(e, "patent_keywords_")}
          />
        </div>
        {renderTable(patentHeaders, "patent")}
      </div>
    </>
  );
};

export default Template11;
