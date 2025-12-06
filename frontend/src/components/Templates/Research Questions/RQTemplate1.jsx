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
  Radio,
  FormControlLabel,
  Box,
} from "@mui/material";

const Template1 = ({ answers, onInputChange }) => {
  const criteria = [
    "Feasible",
    "Does Academic Inventor possess enough capability to investigate the MVRq?",
    "Interesting",
    "Does Academic Inventor and other stakeholders possess significant interest in MVRq?",
    "Novel",
    "Does MVRq lead towards new insights?",
    "Ethical",
    "Is MVRq suitable for ethical committees and review boards?",
    "Relevant",
    "Is MVRq relevant to the scientific community and public interest?",
  ];

  const options = [
    "1 - Strongly Disagree",
    "2 - Disagree",
    "3 - Do not Know",
    "4 - Agree",
    "5 - Strongly Agree",
  ];

  const handleRadioClick = (criterionIndex, optionIndex) => {
    const key = `criterion_${criterionIndex}`;
    const current = answers?.[key];
    const newValue = current === optionIndex ? null : optionIndex;
    onInputChange({ target: { value: newValue } }, key);
  };

  return (
    <div
      className="template-container"
      style={{ maxWidth: "90%", margin: "0 auto" }}
      data-export-section="main-section"
    >
      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Problem Statement */}
        <div
          className="template-column"
          style={{ flex: "1" }}
          data-export-section="text"
        >
          <label className="template-label" htmlFor="ProblemStatment-textarea">
            <strong>Problem Statement Derived</strong>
          </label>
          <TextField
            id="ProblemStatment-textarea"
            placeholder="Write text here"
            multiline
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "#fff" }}
            value={answers?.[`problemStatement_`] || ""}
            onChange={(e) => onInputChange(e, `problemStatement_`)}
          />
        </div>

        {/* Selection Table */}
        <div data-export-section="table">
          <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      background:
                        "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                      color: "white",
                      fontWeight: "bold",
                      width: "30%",
                      minWidth: "200px",
                    }}
                  >
                    Elements
                  </TableCell>
                  {options.map((option, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        background:
                          "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                        color: "white",
                        fontWeight: "bold",
                        width: `${70 / options.length}%`,
                        minWidth: "100px",
                      }}
                    >
                      {option}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {criteria.map((criterion, criterionIndex) => {
                  const selectedOption =
                    answers?.[`criterion_${criterionIndex}`];
                  return (
                    <TableRow key={criterionIndex}>
                      <TableCell
                        sx={{
                          padding: "12px",
                          fontWeight: "bold",
                          verticalAlign: "middle",
                        }}
                      >
                        {criterion}
                      </TableCell>
                      {options.map((_, optionIndex) => (
                        <TableCell key={optionIndex} align="center">
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            minHeight="50px"
                            ml={3}
                          >
                            <FormControlLabel
                              control={
                                <Radio
                                  checked={selectedOption === optionIndex}
                                  onClick={() =>
                                    handleRadioClick(
                                      criterionIndex,
                                      optionIndex
                                    )
                                  }
                                />
                              }
                              label=""
                            />
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
export default Template1;
