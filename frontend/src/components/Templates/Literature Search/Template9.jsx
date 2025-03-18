import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template9.css";

const Template9 = () => {
  return (
    <div className="container">
      {/* Column 1: Problem */}
      <div className="column">
        <h3>Problem</h3>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "50%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-multiline-flexible"
            label="Multiline"
            multiline
            variant="standard"
          />
          <TextField
            label="Synonym II"
            variant="outlined"
            multiline
            minRows={1}
          />
          <TextField
            label="Synonym III"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
        </Box>
      </div>

      {/* Column 2: Problem Solution */}
      <div className="column">
        <h3>Problem Solution</h3>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "80%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Synonym I"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
          <TextField
            label="Synonym II"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
          <TextField
            label="Synonym III"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
        </Box>
      </div>

      <div className="column">
        <h3>Context of Application</h3>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "80%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Synonym I"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
          <TextField
            label="Synonym II"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
          <TextField
            label="Synonym III"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
          />
        </Box>
      </div>
    </div>
  );
};

export default Template9;
