import React from "react";
import "../CSS/Checklist1.css"; // Importing separate CSS file
import { Chip, Divider } from "@mui/material";
import checklistData from "../content/checklistData";

const Checklist = ({
  title = "Checklist",
  selectedComponent,
  onChecklistPointClick,
}) => {
  const steps = checklistData[selectedComponent] || [];

  return (
    <div className="checklist-container">
      <div className="checklist-box">
        <Chip
          label="IN PROGRESS"
          className="custom-chip"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            color: "#dc2626",
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.75em",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            border: "1px solid rgba(220, 38, 38, 0.2)",
          }}
        />

        <div className="steps-container">
          {steps.length > 0 ? (
            steps.map((step) => (
              <React.Fragment key={step.id}>
                {" "}
                {/* Ensure each fragment has a key */}
                <div key={step.id} className={`step`}>
                  <div className="step-info">
                    <span className="step-icon">
                      <img
                        src="/assets/crossmark.png"
                        alt="Not Completed"
                        className="icon-size"
                      />
                    </span>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                    </div>
                  </div>
                  <button
                    className={`step-button ${
                      step.completed ? "edit " : "start"
                    }`}
                    onClick={() => {
                      onChecklistPointClick(step.id);
                    }}
                  >
                    <img src="/assets/pencil.png" alt="Edit" className="icon" />
                    {step.completed ? "Edit" : "Start"}
                  </button>
                </div>
                <Divider variant="middle" />
              </React.Fragment>
            ))
          ) : (
            <p className="no-steps">No steps available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;
