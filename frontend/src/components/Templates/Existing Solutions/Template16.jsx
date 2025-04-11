import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template16.css";

const Template16 = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        Limitations of the existing solutions and reasons behind failing to
        exactly solve the real-world
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
            <th>Limitations Observed</th>
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
                    value={answers?.[`limitationsObserved_${index}`] || ""}
                    onChange={(e) =>
                      onInputChange(e, `limitationsObserved_${index}`)
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

export default Template16;
