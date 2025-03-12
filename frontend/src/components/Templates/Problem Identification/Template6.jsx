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

const ProblemInvestigation = () => {
  return (
    <div className="container">
      <h2>Problem Investigation Script</h2>

      <h3>Introduction by an Academic Inventor</h3>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "30ch" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="Name" variant="outlined" />
        <TextField
          id="outlined-basic"
          label="Institutional Association"
          variant="outlined"
        />
      </Box>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "35ch" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Research Expertise"
          variant="outlined"
        />
      </Box>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Objective of conducting research"
          variant="outlined"
        />
      </Box>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" },
          display: "flex",
          width: "100%", // Ensures the Box takes full width
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-textarea"
          label="Two Minute Story"
          multiline
          fullWidth // Ensures TextField takes full width
        />
      </Box>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" },
          display: "flex",
          width: "100%", // Ensures the Box takes full width
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-textarea"
          label="What is required from this interview?"
          multiline
          fullWidth // Ensures TextField takes full width
        />
      </Box>

      <h3>Problems Identified through 5 Whys Technique</h3>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" },
          display: "flex",
          flexDirection: "column", // Stack elements vertically
          width: "100%", // Ensures the Box takes full width
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
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField multiline fullWidth />
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
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField multiline fullWidth />
      </Box>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="6" className="table-title">
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
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter details..."
                  />
                </td>
                <td>
                  <label>
                    <input type="checkbox" /> High
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" /> Moderate
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" /> Low
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
              <th>Detail of Problems</th>
              <th>
                Rank on Emergency Scale (1 - Not Crucial, 10 - Must Solve Now)
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.id}</td>
                <td>{problem.label}</td>
                <td>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter details..."
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="rank-input"
                    min="1"
                    max="10"
                    placeholder="1-10"
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
          "& > :not(style)": { m: 1, width: "100%" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField multiline fullWidth />
      </Box>

      {/* <div className="form-group">
        <label>
          1. What are three main problems stakeholders are facing? / What tasks
          are difficult to achieve? Where changes are possible?
        </label>
        <textarea rows="3"></textarea>
      </div> */}

      {/* 
      <div className="form-group">
        <label>Research Expertise:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Objective of conducting research:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Two Minute Story:</label>
        <textarea rows="3"></textarea>
      </div>

      <div className="form-group">
        <label>What is required from this interview?</label>
        <textarea rows="2"></textarea>
      </div>

      <div className="form-group">
        <label>Why is it important to have this interview?</label>
        <textarea rows="2"></textarea>
      </div>

      <h3>Problems Identified through 5 Whys Technique</h3>
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="form-group">
          <label>Problem {num}:</label>
          <input type="text" />
        </div>
      ))}

      <div className="form-group">
        <label>
          1. What are three main problems stakeholders are facing? / What tasks
          are difficult to achieve? Where changes are possible?
        </label>
        <textarea rows="3"></textarea>
      </div>

      <h3>Stakeholder Discussion</h3>
      <div className="form-group">
        <label>
          2. Share the already identified 5 problems with the stakeholders and
          discuss these one by one?
        </label>
        <textarea rows="3"></textarea>
      </div>

      <h3>Intensity of Problems (To be asked by Stakeholders)</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Problems</th>
            <th>Detail of Problems</th>
            <th colSpan="3">Intensity of Problem</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <tr key={num}>
              <td>{num}</td>
              <td>**PSKH {num}</td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="checkbox" /> High
              </td>
              <td>
                <input type="checkbox" /> Moderate
              </td>
              <td>
                <input type="checkbox" /> Low
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Rank Problems on Emergency Scale</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Problems</th>
            <th>Detail of Problems</th>
            <th>Rank on Emergency Scale (1 - Not Crucial, 10 - Must Solve Now)</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <tr key={num}>
              <td>{num}</td>
              <td>**PSKH {num}</td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="number" min="1" max="10" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-group">
        <label>
          3. What Standards and Regulations exist within the industry and what
          impact do these involve on the real-world practical problem?
        </label>
        <textarea rows="3"></textarea>
      </div> */}
    </div>
  );
};

export default ProblemInvestigation;
