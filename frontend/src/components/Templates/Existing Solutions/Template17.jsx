import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template17.css";

const Template17 = ({ answers, onInputChange }) => {
  return (
    <div className="container" data-export-section="main-section">
      {/* Header Section */}
      <h3 className="header">
        Patents associated with the existing solutions and their market status.
      </h3>

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
            <th>Patents Details (granted/licensed)</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Automatically fills No. column */}
              <td>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "98%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={answers?.[`patentDetails_${index}`] || ""}
                    onChange={(e) => onInputChange(e, `patentDetails_${index}`)}
                  />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Template17;
