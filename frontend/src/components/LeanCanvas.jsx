import React from "react";

const LeanCanvas = ({ isBlurred }) => {
  return (
    <div className={`lean-canvas flex-col ${isBlurred ? "blur" : ""}`}>
      <div className="row flex">
        <div className="lc-card">II - Literature Search</div>
        <div className="lc-card"> A - Existing Solutions</div>
        <div className="lc-card"> B - Market Landscape</div>
        <div className="lc-card"> C - Novelty</div>
      </div>
      <div className="row flex">
        <div className="lc-card"> I - Problem Identification</div>
        <div className="lc-card"> III - Research Question</div>
        <div className="lc-card"> V - Research Outcome</div>
      </div>
      <div className="row flex">
        <div className="lc-card">IV - Research Methodology</div>
        <div className="lc-card"> D - Key Resources</div>
        <div className="lc-card"> E - Funding</div>
        <div className="lc-card"> F - Team Capacities</div>
      </div>
    </div>
  );
};

export default LeanCanvas;
