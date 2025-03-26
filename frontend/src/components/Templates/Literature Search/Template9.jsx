import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../../CSS/Template9.css";

const Template9 = () => {
  return (
    <div className="container">
      {/* Column 1: Problem */}
      <div className="column">
        <div className="heading">
          <h3>Problem</h3>
        </div>
        <div className="heading">
          <h4>Synonym I</h4>
          <TextField id="outlined-basic" variant="outlined" />
        </div>
        <div className="heading">
          <h4>Synonym II</h4>
          <TextField id="outlined-basic" variant="outlined" />
        </div>
        <div className="heading">
          <h4>Synonym III</h4>
          <TextField id="outlined-basic" variant="outlined" />
        </div>
      </div>

      {/* Column 2: Problem Solution */}
      <div className="column">
        <div className="heading">
          <h3>Problem Solution</h3>
        </div>
        <div className="heading">
          <h4>Synonym I</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
        <div className="heading">
          <h4>Synonym II</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
        <div className="heading">
          <h4>Synonym III</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
      </div>

      {/* Column 3: Context of Application */}
      <div className="column">
        <div className="heading">
          <h3>Context Of Application</h3>
        </div>
        <div className="heading">
          <h4>Synonym I</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
        <div className="heading">
          <h4>Synonym II</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
        <div className="heading">
          <h4>Synonym III</h4>
          <TextField id="outlined-multiline-flexible" multiline maxRows={4} />
        </div>
      </div>
    </div>
  );
};

export default Template9;
