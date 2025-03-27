import React from "react";
import { TextField } from "@mui/material";
import Button from "../../Button";
import "../../../CSS/Template1.css";
import useMediaQuery from "@mui/material/useMediaQuery";

const Template1 = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div className="tem1-container">
      <p className="tem1-description">
        <strong>What</strong> real-world practical problem or unmet need will be
        solved or met by the proposed invention?
      </p>

      <div className="tem1-form-container">
        {[...Array(4)].map((_, index) => (
          <div
            className="tem1-row"
            key={index}
            style={{ flexDirection: "column" }}
          >
            <div className="tem1-column" style={{ width: "100%" }}>
              <label className="tem1-label">
                <strong>Why?</strong> Explore a root cause
              </label>
              <TextField
                className="tem1-input"
                multiline
                size="small"
                variant="outlined"
                fullWidth
                height="20px"
              />
            </div>
            <div className="tem1-column" style={{ width: "100%" }}>
              <label className="tem1-label">
                <strong>References</strong>
              </label>
              <TextField
                className="tem1-input"
                multiline
                minRows={1}
                maxRows={1}
                size="small"
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="tem1-button-group"
        style={{ flexDirection: isSmallScreen ? "column" : "row" }}
      >
        <Button
          label="Reset"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width={isSmallScreen ? "100%" : "auto"}
          marginTop="10px"
        />
        <Button
          label="Save"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width={isSmallScreen ? "100%" : "auto"}
          marginTop="10px"
        />
      </div>
    </div>
  );
};

export default Template1;
