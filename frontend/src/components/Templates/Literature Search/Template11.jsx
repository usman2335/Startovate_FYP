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
      <div className="container" data-export-section="article-section">
        <h3 className="header">
          Article Matrix: Published Work in Research Journals and Conference
          Proceedings
        </h3>
        <div className="search-container" data-export-section="text">
          <span className="search-label">Keywords:</span>
          <TextField
            id="outlined-search"
            type="search"
            fullWidth
            value={answers?.["keywords_"] || ""}
            onChange={(e) => onInputChange(e, "keywords_")}
          />
        </div>
        <div data-export-section="table">
          {renderTable(articleHeaders, "article")}
        </div>
      </div>

      {/* Patent Matrix */}
      <div className="container" data-export-section="patent-section">
        <h3 className="header">Patent Matrix</h3>
        <div className="search-container" data-export-section="text">
          <span className="search-label">Keywords:</span>
          <TextField
            id="outlined-search"
            type="search"
            fullWidth
            value={answers?.["patent_keywords_"] || ""}
            onChange={(e) => onInputChange(e, "patent_keywords_")}
          />
        </div>
        <div data-export-section="table">
          {renderTable(patentHeaders, "patent")}
        </div>
      </div>
    </>
  );
};

export default Template11;
