import React from "react";
import "../CSS/Checklist1.css"; // Importing separate CSS file
import { Chip, Divider } from "@mui/material";



const Checklist = ({ title = "Checklist", steps = [] }) => {
  const completedSteps = steps.filter((step) => step.completed).length;
  const progressPercentage = steps.length ? (completedSteps / steps.length) * 100 : 0;

  return (
    <div className="checklist-container">
    <h2>My Checklist</h2>
    <div className="checklist-box">
     <Chip label="IN PROGRESS" className="custom-chip" style={{ backgroundColor: "#FFD7E4", color: "#ED1717", fontWeight: "bold" }}/>

      <div className="checklist-header">
        
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-percent">{progressPercentage.toFixed(0)}% Completed</div>
      </div>

      <div className="steps-container">
        {steps.length > 0 ? (
          steps.map((step) => (
            <>
            <div key={step.id} className={`step`}>
              <div className="step-info">
                <span className="step-icon">
                  {step.completed ? (
                    <img src="src\assets\checkmak.png" alt="Completed" className="icon-size" />
                  ) : (
                    <img src="src\assets\crossmark.png" alt="Not Completed" className="icon-size" />
                  )}
                </span>
                <div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
              <button className={`step-button ${step.completed ? "edit" : "start"}`}>
                <img src="src\assets\pencil.png" alt="Edit" className="icon" />
                {step.completed ? "Edit" : "Start"}
              </button>
              
            </div>
            
            <Divider variant="middle" component="" />
            </>

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
