import React from "react";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template11.css";

const Template14 = ({ answers, onInputChange }) => {
  return (
    <div className="container" data-export-section="main-section">
      {/* Header Section */}
      <h3 className="header">
        Listing of solutions of the real-world problem already available in the
        market.
      </h3>

      {/* Search Bar Section */}
      <div className="search-container" data-export-section="text">
        <span className="search-label">Keywords:</span>
        <TextField
          id="outlined-search"
          type="search"
          fullWidth
          value={answers?.[`keywords_`] || ""}
          onChange={(e) => onInputChange(e, `keywords_`)}
        />
      </div>

      {/* Table Section */}
      <div data-export-section="table">
        <table className="table">
          <thead>
            {/* Market Matrix Row */}
            <tr className="table-title-row">
              <th colSpan="3" className="table-title">
                Market Matrix
              </th>
            </tr>
            <tr>
              <th>No.</th>
              <th>Existing Solutions</th>
              <th>Features Offered</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Automatically fills No. column */}
                <td>
                  <input
                    type="text"
                    className="input-box"
                    value={answers?.[`existingSolutions_${index}`] || ""}
                    onChange={(e) =>
                      onInputChange(e, `existingSolutions_${index}`)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="input-box"
                    value={answers?.[`featuresOffered_${index}`] || ""}
                    onChange={(e) =>
                      onInputChange(e, `featuresOffered_${index}`)
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

export default Template14;
