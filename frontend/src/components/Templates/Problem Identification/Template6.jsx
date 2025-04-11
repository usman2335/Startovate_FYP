import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template6.css";
const problems = [
  { id: 1, label: "**PSKH 1" },
  { id: 2, label: "**PSKH 2" },
  { id: 3, label: "**PSKH 3" },
  { id: 4, label: "*PAC 1" },
  { id: 5, label: "*PAC 2" },
  { id: 6, label: "*PAC 3" },
  { id: 7, label: "*PAC 4" },
  { id: 8, label: "*PAC 5" },
];

const ProblemInvestigation = ({ answers, onInputChange }) => {
  return (
    <div className="container">
      <h2>Problem Investigation Script</h2>

      <h3>Introduction by an Academic Inventor</h3>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
          gap: "10px",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          fullWidth
          value={answers?.[`name_`] || ""}
          onChange={(e) => onInputChange(e, `name_`)}
        />
        <TextField
          id="outlined-basic"
          label="Institutional Association"
          variant="outlined"
          fullWidth
          value={answers?.[`instAsso_`] || ""}
          onChange={(e) => onInputChange(e, `instAsso_`)}
        />
      </Box>

      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Research Expertise"
          variant="outlined"
          fullWidth
          value={answers?.[`resExp_`] || ""}
          onChange={(e) => onInputChange(e, `resExp_`)}
        />
      </Box>

      <Box
        component="form"
        sx={{
          width: "100%",
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Objective of conducting research"
          variant="outlined"
          fullWidth
          value={answers?.[`obj_`] || ""}
          onChange={(e) => onInputChange(e, `obj_`)}
        />
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-textarea"
          label="Two Minute Story"
          multiline
          fullWidth
          value={answers?.[`twominstory_`] || ""}
          onChange={(e) => onInputChange(e, `twominstory_`)}
        />
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-textarea"
          label="What is required from this interview?"
          multiline
          fullWidth
          value={answers?.[`whatIsRequired_`] || ""}
          onChange={(e) => onInputChange(e, `whatIsRequired_`)}
        />
      </Box>

      <h3>Problems Identified through 5 Whys Technique</h3>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <TextField
            key={num}
            id={`outlined-textarea-${num}`}
            label={`Problem ${num}`}
            multiline
            fullWidth
            onChange={(e) => onInputChange(e, `problem_${num}`)}
            value={answers?.[`problem_${num}`] || ""}
          />
        ))}
      </Box>

      <h4>
        1. What are three main problems stakeholders are facing? What are
        difficult to achieve? Where changes are possible?
      </h4>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          multiline
          fullWidth
          value={answers?.[`threeMainProblems_`] || ""}
          onChange={(e) => onInputChange(e, `threeMainProblems_`)}
        />
      </Box>

      <h5>
        NOTE: Once 3 problems are given by stakeholder, try to find any match
        with already identified 5 problems.
      </h5>

      <h4>
        2. Share the already identified 5 problems with the stakeholders and
        discuss their limitations one by one?
      </h4>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          multiline
          fullWidth
          value={answers?.[`limitations_`] || ""}
          onChange={(e) => onInputChange(e, `limitations_`)}
        />
      </Box>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="6">
                Intensity of Problems (To be asked by Stakeholders)
              </th>
            </tr>
            <tr>
              <th>No.</th>
              <th>Problems</th>
              <th>Detail of Problems</th>
              <th colSpan="3">Intensity of Problem</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.id}</td>
                <td>{problem.label}</td>
                <td>
                  <TextField
                    multiline
                    fullWidth
                    minRows={1}
                    value={answers?.[`detail_${problem.id}`] || ""}
                    onChange={(e) => onInputChange(e, `detail_${problem.id}`)}
                  />
                </td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        answers?.[`intensity_high_${problem.id}`] || false
                      }
                      onChange={(e) =>
                        onInputChange(
                          e,
                          `intensity_high_${problem.id}`,
                          e.target.checked
                        )
                      }
                    />
                    High
                  </label>
                </td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        answers?.[`intensity_moderate_${problem.id}`] || false
                      }
                      onChange={(e) =>
                        onInputChange(
                          e,
                          `intensity_moderate_${problem.id}`,
                          e.target.checked
                        )
                      }
                    />{" "}
                    Moderate
                  </label>
                </td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        answers?.[`intensity_low_${problem.id}`] || false
                      }
                      onChange={(e) =>
                        onInputChange(
                          e,
                          `intensity_low_${problem.id}`,
                          e.target.checked
                        )
                      }
                    />{" "}
                    Low
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="table-note">
                *PAC = Problem Identified by Academic Inventor; <br />
                **PSKH = Problem Identified by Stakeholder
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="4" className="table-title">
                Rank Problems on Emergency Scale
              </th>
            </tr>
            <tr>
              <th>No.</th>
              <th>Problems</th>
              <th colSpan="1">Detail of Problems</th>
              <th colSpan="5">
                Rank on Emergency Scale (1 - Not Crucial, 10 - Must Solve Now)
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.id}</td>
                <td>{problem.label}</td>
                <td colSpan="1">
                  <TextField
                    size="small"
                    className="input-box"
                    placeholder="Enter details..."
                    value={answers?.[`detail_${problem.id}`] || ""}
                    onChange={(e) => onInputChange(e, `detail_${problem.id}`)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="rank-input"
                    min="1"
                    max="10"
                    placeholder="1-10"
                    value={answers?.[`rank_${problem.id}`] || ""}
                    onChange={(e) => onInputChange(e, `rank_${problem.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="table-note">
                *PAC = Problem Identified by Academic Inventor; <br />
                **PSKH = Problem Identified by Stakeholder
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h4>
        3. What Standards and Regulations exist within industry and what impact
        these involve on the real- world ractical roblem?
      </h4>
      <Box
        component="form"
        sx={{
          display: "flex",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          multiline
          fullWidth
          value={answers?.[`standards_`] || ""}
          onChange={(e) => onInputChange(e, `standards_`)}
        />
      </Box>
    </div>
  );
};

export default ProblemInvestigation;
