import React from "react";
import "../../../CSS/Template2.css";
import Button from "../../Button";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Template2 = ({ answers, onInputChange }) => {
  const rows = [
    {
      id: 1,
      outcome: "Article Matrix – Research Gap",
      statement: "synthesizedStatement1",
    },
    {
      id: 2,
      outcome: "Patent Matrix – Claim",
      statement: "synthesizedStatement2",
    },
    {
      id: 3,
      outcome: "Market Matrix – Limitations",
      statement: "synthesizedStatement3",
    },
    { id: 4, outcome: "Novelty Feature", statement: "synthesizedStatement4" },
  ];

  return (
    <div
      className="template-container"
      style={{ maxWidth: "90%", margin: "0 auto" }}
    >
      <h2 style={{ color: "black", padding: "10px" }}>Synthesis Matrix</h2>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="keywords"
          style={{ display: "block", marginBottom: "10px", textAlign: "left" }}
        >
          Keywords:
        </label>
        <TextField
          id="keywords"
          variant="outlined"
          size="small"
          fullWidth
          value={answers?.[`keywords_`] || ""}
          onChange={(e) => onInputChange(e, `keywords_`)}
        />
      </div>

      <TableContainer
        component={Paper}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  background:
                    "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                No.
              </TableCell>
              <TableCell
                sx={{
                  background:
                    "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Outcome
              </TableCell>
              <TableCell
                sx={{
                  background:
                    "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Synthesized Statements
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: "bold" }}>{row.id}.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{row.outcome}</TableCell>
                <TableCell>
                  <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    value={answers?.[`statement_${row.id}`] || ""}
                    onChange={(e) => onInputChange(e, `statement_${row.id}`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Template2;
