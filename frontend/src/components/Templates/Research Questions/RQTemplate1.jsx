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
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const Template1 = () => {
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

  return (
    <div className="template-container" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <p className="template-description">
        <strong>LCI Template XX</strong>
      </p>

      <div className="template-form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="template-column" style={{ flex: "1" }}>
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
          />
        </div>

        {/* Selection Box Table */}
        <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                    color: "white",
                  }}
                >
                  Elements
                </TableCell>
                {options.map((option, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
                      color: "white",
                    }}
                  >
                    {option}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {criteria.map((criterion, index) => (
                <TableRow key={index}>
                  <TableCell>{criterion}</TableCell>
                  {options.map((_, optionIndex) => (
                    <TableCell key={optionIndex} align="center">
                      <RadioGroup row name={`criterion-${index}`}>
                        <FormControlLabel
                          value={optionIndex + 1}
                          control={<Radio />}
                          label=""
                        />
                      </RadioGroup>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="template-button-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <Button
            label="Reset"
            onClick={() => {}}
            padding="10px 20px"
            color="white"
            fontSize="16px"
            width="auto"
            marginTop="10px"
          />
          <Button
            label="Save"
            onClick={() => {}}
            padding="10px 20px"
            color="white"
            fontSize="16px"
            width="auto"
            marginTop="10px"
          />
        </div>
      </div>
    </div>
  );
};

export default Template1;
