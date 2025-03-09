import React from "react";

const LeanCanvas = ({ isBlurred, onComponentClick }) => {
  return (
    <div className={`lean-canvas flex-col ${isBlurred ? "blur" : ""}`}>
      <div className="row flex">
        <div
          className="lc-card"
          onClick={() => onComponentClick("Literature Search")}
        >
          II - Literature Search
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Existing Solutions")}
        >
          A - Existing Solutions
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Market Landscape")}
        >
          B - Market Landscape
        </div>
        <div className="lc-card" onClick={() => onComponentClick("Novelty")}>
          C - Novelty
        </div>
      </div>
      <div className="row flex">
        <div
          className="lc-card"
          onClick={() => onComponentClick("Problem Identification")}
        >
          I - Problem Identification
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Research Question")}
        >
          III - Research Question
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Research Outcome")}
        >
          V - Research Outcome
        </div>
      </div>
      <div className="row flex">
        <div
          className="lc-card"
          onClick={() => onComponentClick("Research Methodology")}
        >
          IV - Research Methodology
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Key Resources")}
        >
          D - Key Resources
        </div>
        <div className="lc-card" onClick={() => onComponentClick("Funding")}>
          E - Funding
        </div>
        <div
          className="lc-card"
          onClick={() => onComponentClick("Team Capacities")}
        >
          F - Team Capacities
        </div>
      </div>
    </div>
  );
};

export default LeanCanvas;
