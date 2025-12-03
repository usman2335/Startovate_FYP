// below code is the latest that i commented

// import React, { useState } from "react";
// import "../../../CSS/Template5.css";

// const StakeholderMatrix = () => {
//   const [stakeholders, setStakeholders] = useState({
//     q1: [],
//     q2: [],
//     q3: [],
//     q4: [],
//   });

//   const [inputs, setInputs] = useState({
//     q1: "",
//     q2: "",
//     q3: "",
//     q4: "",
//   });

//   const handleAddStakeholder = (quadrant) => {
//     if (inputs[quadrant].trim() !== "") {
//       setStakeholders((prev) => ({
//         ...prev,
//         [quadrant]: [...prev[quadrant], inputs[quadrant].trim()],
//       }));
//       setInputs((prev) => ({ ...prev, [quadrant]: "" }));
//     }
//   };

//   const handleRemoveStakeholder = (quadrant, index) => {
//     setStakeholders((prev) => ({
//       ...prev,
//       [quadrant]: prev[quadrant].filter((_, i) => i !== index),
//     }));
//   };

//   const renderQuadrant = (quadrantKey, title, className) => (
//     <div className={`quadrant ${className}`}>
//       <div className="quadrant-title">{title}</div>
//       <div className="stakeholders">
//         {stakeholders[quadrantKey].map((name, index) => (
//           <div className="stakeholder-item" key={index}>
//             <span>{name}</span>
//             <button
//               className="remove-btn"
//               onClick={() => handleRemoveStakeholder(quadrantKey, index)}
//             >
//               ❌
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           className="input-box"
//           placeholder="Enter stakeholder"
//           value={inputs[quadrantKey]}
//           onChange={(e) =>
//             setInputs({ ...inputs, [quadrantKey]: e.target.value })
//           }
//         />
//         <button
//           className="add-btn"
//           onClick={() => handleAddStakeholder(quadrantKey)}
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="matrix-container">
//       {renderQuadrant("q1", "High Interest, Low Influence", "q1")}
//       {renderQuadrant("q2", "High Interest, High Influence", "q2")}
//       {renderQuadrant("q3", "Low Interest, Low Influence", "q3")}
//       {renderQuadrant("q4", "Low Interest, High Influence", "q4")}
//     </div>
//   );
// };

// export default StakeholderMatrix;

// below part was already commented out in the original code, so it is not included in the final code.

// import React, { useState } from "react";
// import html2canvas from "html2canvas"; // make sure this is installed
// import "../../../CSS/Template5.css";

// const StakeholderMatrix = () => {
//   const [stakeholders, setStakeholders] = useState({
//     q1: [],
//     q2: [],
//     q3: [],
//     q4: [],
//   });

//   const [inputs, setInputs] = useState({
//     q1: "",
//     q2: "",
//     q3: "",
//     q4: "",
//   });

//   const handleAddStakeholder = (quadrant) => {
//     if (inputs[quadrant].trim() !== "") {
//       setStakeholders((prev) => ({
//         ...prev,
//         [quadrant]: [...prev[quadrant], inputs[quadrant].trim()],
//       }));
//       setInputs((prev) => ({ ...prev, [quadrant]: "" }));
//     }
//   };

//   const handleRemoveStakeholder = (quadrant, index) => {
//     setStakeholders((prev) => ({
//       ...prev,
//       [quadrant]: prev[quadrant].filter((_, i) => i !== index),
//     }));
//   };

//   const renderQuadrant = (quadrantKey, title, className) => (
//     <div className={`quadrant ${className}`}>
//       <div className="quadrant-title">{title}</div>
//       <div className="stakeholders">
//         {stakeholders[quadrantKey].map((name, index) => (
//           <div className="stakeholder-item" key={index}>
//             <span>{name}</span>
//             <button
//               className="remove-btn"
//               onClick={() => handleRemoveStakeholder(quadrantKey, index)}
//             >
//               ❌
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           className="input-box"
//           placeholder="Enter stakeholder"
//           value={inputs[quadrantKey]}
//           onChange={(e) =>
//             setInputs({ ...inputs, [quadrantKey]: e.target.value })
//           }
//         />
//         <button
//           className="add-btn"
//           onClick={() => handleAddStakeholder(quadrantKey)}
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );

//   const downloadScreenshot = () => {
//     const element = document.getElementById("stakeholder-capture");
//     html2canvas(element).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "stakeholder-matrix.png";
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     });
//   };

//   return (
//     <div>
//       <div id="stakeholder-capture" className="matrix-container">
//         {renderQuadrant("q1", "High Interest, Low Influence", "q1")}
//         {renderQuadrant("q2", "High Interest, High Influence", "q2")}
//         {renderQuadrant("q3", "Low Interest, Low Influence", "q3")}
//         {renderQuadrant("q4", "Low Interest, High Influence", "q4")}
//       </div>

//       <button
//         onClick={downloadScreenshot}
//         style={{
//           marginTop: "20px",
//           padding: "10px 20px",
//           fontSize: "16px",
//           cursor: "pointer",
//         }}
//       >
//         Download Screenshot
//       </button>
//     </div>
//   );
// };

// export default StakeholderMatrix;

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import "../../../CSS/Template5.css";
import Button from "../../Button";
import axios from "axios";

const StakeholderMatrix = ({ canvasId, templateId }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const matrixRef = useRef();

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
        [quadrant]: [...prev[quadrant], inputs[quadrant].trim()],
      }));
      setInputs((prev) => ({ ...prev, [quadrant]: "" }));
    }
  };

  const handleRemoveStakeholder = (quadrant, index) => {
    setStakeholders((prev) => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((_, i) => i !== index),
    }));
  };

  const renderQuadrant = (quadrantKey, title, className) => (
    <div className={`quadrant ${className}`} key={quadrantKey}>
      <div className="quadrant-title">{title}</div>
      <div className="stakeholders">
        {stakeholders[quadrantKey].map((name, index) => (
          <div className="stakeholder-item" key={index}>
            <span>{name}</span>
            <button
              className="remove-btn"
              onClick={() => handleRemoveStakeholder(quadrantKey, index)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input-box"
          placeholder="Enter stakeholder"
          value={inputs[quadrantKey]}
          onChange={(e) =>
            setInputs({ ...inputs, [quadrantKey]: e.target.value })
          }
        />
        <button
          className="add-btn"
          onClick={() => handleAddStakeholder(quadrantKey)}
        >
          Add
        </button>
      </div>
    </div>
  );

  const handleExportAsImage = async () => {
    if (!matrixRef.current) return;

    try {
      const canvas = await html2canvas(matrixRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imageData = canvas.toDataURL("image/png");

      const payload = {
        canvasId,
        templateId,
        imageData, // base64 image
        exportMode: "image",
        imageTitle: "Stakeholder Matrix",
      };

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/template/export-image`,
        payload,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template5_StakeholderMatrix.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export image:", err);
    }
  };

  return (
    <>
      <div className="matrix-container" ref={matrixRef}>
        {renderQuadrant("q1", "High Interest, Low Influence", "q1")}
        {renderQuadrant("q2", "High Interest, High Influence", "q2")}
        {renderQuadrant("q3", "Low Interest, Low Influence", "q3")}
        {renderQuadrant("q4", "Low Interest, High Influence", "q4")}
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button onClick={handleExportAsImage}>Export to Word (as Image)</Button>
      </div>
    </>
  );
};

export default StakeholderMatrix;
