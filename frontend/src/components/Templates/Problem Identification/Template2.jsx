// import React from "react";
// import "../../../CSS/Template2.css";
// import { TextField } from "@mui/material";

// const Template2 = ({ answers, onInputChange }) => {
//   return (
//     <div
//       className="template-container"
//       style={{ maxWidth: "90%", margin: "0 auto" }}
//     >
//       <p className="template-description">
//         <strong>Incident, event or condition</strong> causing and characterizing
//         the real-world practical problem.
//       </p>

//       <div
//         className="template-form"
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//       >
//         <div className="template-column" style={{ flex: "1" }}>
//           <label className="template-label">
//             <strong> Enter Incident, event, or condition here.</strong>
//           </label>
//           <TextField
//             id="incident-textarea"
//             placeholder="Write text here"
//             multiline
//             variant="outlined"
//             fullWidth
//             sx={{ backgroundColor: "#fff" }}
//             value={answers?.[`incident_`] || ""}
//             onChange={(e) => onInputChange(e, `incident_`)}
//           />
//         </div>

//         <div className="template-column" style={{ flex: "1" }}>
//           <label className="template-label">
//             <strong>Feedback</strong>
//           </label>
//           <TextField
//             id="feedback-textarea"
//             placeholder="Write your feedback here..."
//             multiline
//             variant="outlined"
//             fullWidth
//             sx={{ backgroundColor: "#fff" }}
//             value={answers?.[`feedback_`] || ""}
//             onChange={(e) => onInputChange(e, `feedback_`)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Template2;

import React from "react";
import "../../../CSS/Template2.css";
import { TextField } from "@mui/material";
import Button from "../../Button";
import axios from "axios";

const Template2 = ({ answers, onInputChange, canvasId, templateId }) => {
  const handleExportToWord = async () => {
    try {
      const payload = {
        canvasId,
        templateId,
        exportMode: "text", // optional flag
        heading:
          "Incident, event or condition causing and characterizing the real-world practical problem.",
        formattedData: {
          incident: answers?.[`incident_`] || "",
          feedback: answers?.[`feedback_`] || "",
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/template/export-text",
        payload,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template2_Export.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting Word document:", error);
    }
  };

  return (
    <div
      className="template-container"
      style={{ maxWidth: "90%", margin: "0 auto" }}
    >
      <p className="template-description">
        <strong>Incident, event or condition</strong> causing and characterizing
        the real-world practical problem.
      </p>

      <div
        className="template-form"
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div className="template-column" style={{ flex: "1" }}>
          <label className="template-label">
            <strong>Enter Incident, event, or condition here:</strong>
          </label>
          <TextField
            id="incident-textarea"
            placeholder="Describe the event/condition..."
            multiline
            minRows={4}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "#fff" }}
            value={answers?.[`incident_`] || ""}
            onChange={(e) => onInputChange(e, `incident_`)}
          />
        </div>

        <div className="template-column" style={{ flex: "1" }}>
          <label className="template-label">
            <strong>Feedback:</strong>
          </label>
          <TextField
            id="feedback-textarea"
            placeholder="Write your feedback here..."
            multiline
            minRows={4}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "#fff" }}
            value={answers?.[`feedback_`] || ""}
            onChange={(e) => onInputChange(e, `feedback_`)}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Button onClick={handleExportToWord}>
            Export to Word (Editable)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Template2;
