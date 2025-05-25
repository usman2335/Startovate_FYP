import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template18.css";

const Template18 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        Listing of companies licensing patents for offering existing solutions.
      </div>

      {/* Table Section */}
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
            <th>Companies offering Existing Solutions</th>
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
                    value={answers?.[`companiesOffering_${index}`] || ""}
                    onChange={(e) =>
                      onInputChange(e, `companiesOffering_${index}`)
                    }
                  />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Template18;
