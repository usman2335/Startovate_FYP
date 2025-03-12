import React, { useState } from "react";
import "../../../CSS/Template5.css";

const StakeholderMatrix = () => {
  const [stakeholders, setStakeholders] = useState({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
  });

  const [inputs, setInputs] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleAddStakeholder = (quadrant) => {
    if (inputs[quadrant].trim() !== "") {
      setStakeholders((prev) => ({
        ...prev,
        [quadrant]: [...prev[quadrant], inputs[quadrant]],
      }));
      setInputs((prev) => ({ ...prev, [quadrant]: "" }));
    }
  };

  return (
    <div className="matrix-container">
      {/* Axis */}
      <div className="axis">
        <div className="x-axis"></div>
        <div className="y-axis"></div>
      </div>

      {/* Quadrants */}
      <div className="quadrant q1" style={{ top: "5%", left: "5%" }}>
        <div className="quadrant-title">High Interest, Low Influence</div>
        <div className="stakeholders">
          {stakeholders.q1.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-box"
            placeholder="Enter stakeholder"
            value={inputs.q1}
            onChange={(e) => setInputs({ ...inputs, q1: e.target.value })}
          />
          <button
            className="add-btn"
            onClick={() => handleAddStakeholder("q1")}
          >
            Add
          </button>
        </div>
      </div>

      <div className="quadrant q2" style={{ top: "5%", right: "5%" }}>
        <div className="quadrant-title">High Interest, High Influence</div>
        <div className="stakeholders">
          {stakeholders.q2.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-box"
            placeholder="Enter stakeholder"
            value={inputs.q2}
            onChange={(e) => setInputs({ ...inputs, q2: e.target.value })}
          />
          <button
            className="add-btn"
            onClick={() => handleAddStakeholder("q2")}
          >
            Add
          </button>
        </div>
      </div>

      <div className="quadrant q3" style={{ bottom: "5%", left: "5%" }}>
        <div className="quadrant-title">Low Interest, Low Influence</div>
        <div className="stakeholders">
          {stakeholders.q3.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-box"
            placeholder="Enter stakeholder"
            value={inputs.q3}
            onChange={(e) => setInputs({ ...inputs, q3: e.target.value })}
          />
          <button
            className="add-btn"
            onClick={() => handleAddStakeholder("q3")}
          >
            Add
          </button>
        </div>
      </div>

      <div className="quadrant q4" style={{ bottom: "5%", right: "5%" }}>
        <div className="quadrant-title">Low Interest, High Influence</div>
        <div className="stakeholders">
          {stakeholders.q4.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-box"
            placeholder="Enter stakeholder"
            value={inputs.q4}
            onChange={(e) => setInputs({ ...inputs, q4: e.target.value })}
          />
          <button
            className="add-btn"
            onClick={() => handleAddStakeholder("q4")}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeholderMatrix;
