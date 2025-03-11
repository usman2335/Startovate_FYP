import React, { useState } from "react";
import "../../CSS/Template2.css";


const StakeholderMapping = () => {
    return (
      <div className="stakeholder-container">
        {/* Stakeholder Identification Form */}
        <div className="stakeholder-form">
          <h2>Stakeholder Identification</h2>
          <form>
            <input type="text" placeholder="Stakeholder Name" />
            <input type="text" placeholder="Role" />
            <input type="text" placeholder="Interest Level" />
            <input type="text" placeholder="Influence Level" />
            <button type="submit">Add Stakeholder</button>
          </form>
        </div>
  
        {/* Stakeholder Mapping Matrix */}
        <div className="stakeholder-matrix">
          <h2>Stakeholder Mapping Matrix</h2>
          <div className="matrix-grid">
            <div className="quadrant high-interest-low-influence">
              <p>High Interest, Low Influence</p>
              <input type="text" placeholder="Enter Answer" />
            </div>
            <div className="quadrant high-interest-high-influence">
              <p>High Interest, High Influence</p>
              <input type="text" placeholder="Enter Answer" />
            </div>
            <div className="quadrant low-interest-low-influence">
              <p>Low Interest, Low Influence</p>
              <input type="text" placeholder="Enter Answer" />
            </div>
            <div className="quadrant low-interest-high-influence">
              <p>Low Interest, High Influence</p>
              <input type="text" placeholder="Enter Answer" />
            </div>
          </div>
        </div>
  
        {/* Two-Minute Pitch Section */}
        <div className="pitch-section">
          <h2>Two-Minute Pitch</h2>
          <textarea placeholder="Write your two-minute pitch here..."></textarea>
        </div>
      </div>
    );
  };
  
  export default StakeholderMapping;
  