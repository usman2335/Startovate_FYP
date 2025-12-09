// import React, { useState } from "react";
// import "../../../CSS/Template3.css";

// import { TextField } from "@mui/material";

// const Template3 = ({ answers, onInputChange }) => {
//   return (
//     <div className="container" style={{ maxWidth: "90%", margin: "0 auto" }}>
//       <p className="description" style={{ textAlign: "center" }}>
//         <strong>Motivation and justification</strong> of the proposed invention
//         for solving the real-world practical problem.
//       </p>

//       <div
//         className="template-form"
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//       >
//         <div className="column" style={{ width: "100%" }}>
//           <label>
//             <strong>Enter Motivation and Justification</strong>
//           </label>
//           <TextField
//             placeholder="Enter text here..."
//             multiline
//             fullWidth
//             variant="outlined"
//             minRows={2}
//             sx={{ backgroundColor: "#fff" }}
//             value={answers?.[`motivation_`] || ""}
//             onChange={(e) => onInputChange(e, `motivation_`)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Template3;

import React from "react";
import "../../../CSS/Template3.css";
import { TextField } from "@mui/material";
import Button from "../../Button";
import axios from "axios";

const Template3 = ({ answers, onInputChange, canvasId, templateId }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const handleExportToWord = async () => {
    try {
      const payload = {
        canvasId,
        templateId,
        exportMode: "text",
        heading:
          "Motivation and justification of the proposed invention for solving the real-world practical problem.",
        formattedData: {
          motivation: answers?.[`motivation_`] || "",
        },
      };

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/template/export-text`,
        payload,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template3_Export.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting Word document:", error);
    }
  };

  return (
    <div className="">
      <div className="heading-section">
        <div className="description-wrapper">
          <h3 className="description">
            <span className="description-highlight">
              Motivation and justification
            </span>{" "}
            of the proposed invention for solving the real-world practical
            problem.
          </h3>
        </div>
      </div>

      <div className="content-section">
        <div className="template-form" data-export-section="text">
          <div className="column">
            <label className="template-label">
              <strong>Enter Motivation and Justification:</strong>
            </label>
            <TextField
              placeholder="Write your motivation and justification here..."
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
              sx={{ backgroundColor: "#fff" }}
              value={answers?.[`motivation_`] || ""}
              onChange={(e) => onInputChange(e, `motivation_`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;
