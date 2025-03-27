import React from "react";
import "../../../CSS/Template1.css";
import Button from "../../Button";

const Template1 = ({ answers, onInputChange }) => {
  console.log(answers);
  return (
    <div className="tem1-container">
      <p className="tem1-description">
        <strong>What</strong> real-world practical problem or unmet need will be
        solved or met by the proposed invention?
      </p>

      <div className="tem1-form-container">
        {[...Array(4)].map((_, index) => (
          <div className="tem1-row" key={index}>
            <div className="tem1-column">
              <label className="tem1-label">
                <strong>Why?</strong> Explore a root cause
              </label>
              <input
                className="tem1-input"
                type="text"
                onChange={(e) => onInputChange(e, `why_${index}`)}
                value={answers?.[`why_${index}`] || ""}
              />
            </div>
            <div className="tem1-column">
              <label className="tem1-label">
                <strong>References</strong>
              </label>
              <input
                className="tem1-input"
                type="text"
                onChange={(e) => onInputChange(e, `references_${index}`)}
                value={answers?.[`references_${index}`] || ""}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template1;
