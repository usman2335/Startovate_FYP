import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template9.css";

const Template9 = () => {
  return (
    <div className="template9-container">
      {/* Column 1: Problem */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Problem</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField fullWidth multiline variant="outlined" />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField fullWidth multiline variant="outlined" />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField fullWidth multiline variant="outlined" />
        </div>
      </div>

      {/* Column 2: Problem Solution */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Problem Solution</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField fullWidth multiline variant="outlined" />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField fullWidth multiline maxRows={4} variant="outlined" />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField fullWidth multiline maxRows={4} variant="outlined" />
        </div>
      </div>

      {/* Column 3: Context of Application */}
      <div className="template9-column">
        <div className="template9-section">
          <h3>Context Of Application</h3>
        </div>
        <div className="template9-section">
          <h4>Synonym I</h4>
          <TextField fullWidth multiline maxRows={4} variant="outlined" />
        </div>
        <div className="template9-section">
          <h4>Synonym II</h4>
          <TextField fullWidth multiline maxRows={4} variant="outlinedasd" />
        </div>
        <div className="template9-section">
          <h4>Synonym III</h4>
          <TextField fullWidth multiline maxRows={4} variant="outlined" />
        </div>
      </div>
    </div>
  );
};

export default Template9;
