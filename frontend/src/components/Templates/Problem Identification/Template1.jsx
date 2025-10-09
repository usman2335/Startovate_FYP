// import React from "react";
// import { TextField } from "@mui/material";
// import Button from "../../Button";
// import "../../../CSS/Template1.css";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import axios from "axios";
// import html2canvas from "html2canvas";

// const Template1 = ({ answers, onInputChange, canvasId, templateId }) => {
//   const isSmallScreen = useMediaQuery("(max-width:600px)");

//   const downloadWord = async () => {
//     // const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

//     // if (!token) {
//     //   console.error("No token found.");
//     //   return;
//     // }

//     try {
//       console.log("canvasId:", canvasId);
//       console.log("templateId:", templateId);
//       const response = await axios.get(
//         `http://localhost:5000/api/template/export/${canvasId}/${templateId}`,
//         // { canvasId: canvasId, templateId: templateId },
//         { withCredentials: true }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error response from server:", errorData);
//         return;
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "template1_export.docx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error exporting Word document:", error);
//     }
//   };

//   return (
//     <div id="template-capture">
//       <div className="tem1-container">
//         <p className="tem1-description">
//           <strong>What</strong> real-world practical problem or unmet need will
//           be solved or met by the proposed invention?
//         </p>

//         <div className="tem1-form-container">
//           {[...Array(4)].map((_, index) => (
//             <div
//               className="tem1-row"
//               key={index}
//               style={{ flexDirection: "column" }}
//             >
//               <div className="tem1-column" style={{ width: "100%" }}>
//                 <label className="tem1-label">
//                   <strong>Why?</strong> Explore a root cause
//                 </label>
//                 <TextField
//                   className="tem1-input"
//                   multiline
//                   size="small"
//                   variant="outlined"
//                   fullWidth
//                   height="20px"
//                   onChange={(e) => onInputChange(e, `why_${index}`)}
//                   value={answers?.[`why_${index}`] || ""}
//                 />
//               </div>
//               <div className="tem1-column" style={{ width: "100%" }}>
//                 <label className="tem1-label">
//                   <strong>References</strong>
//                 </label>
//                 <TextField
//                   className="tem1-input"
//                   multiline
//                   minRows={1}
//                   maxRows={1}
//                   size="small"
//                   variant="outlined"
//                   fullWidth
//                   onChange={(e) => onInputChange(e, `references_${index}`)}
//                   value={answers?.[`references_${index}`] || ""}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* <Button onClick={downloadWord}>Export to Word</Button> */}
//         <Button
//           onClick={() => {
//             html2canvas(document.getElementById("template-capture")).then(
//               (canvas) => {
//                 document.body.appendChild(canvas); // just preview screenshot
//               }
//             );
//           }}
//         >
//           Preview Screenshot
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Template1;
// import React from "react";
// import html2canvas from "html2canvas";
// import { TextField, Button } from "@mui/material";

// const Template1 = ({ answers, onInputChange }) => {
//   const handleDownloadScreenshot = () => {
//     const element = document.getElementById("capture-only");
//     if (!element) {
//       console.error("Element not found!");
//       return;
//     }

//     html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     }).then((canvas) => {
//       const link = document.createElement("a");
//       link.download = "template-screenshot.png";
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     });
//   };

//   return (
//     <div id="template-capture">
//       <div className="tem1-container">
//         <div id="capture-only">
//           <p className="tem1-description">
//             <strong>What</strong> real-world practical problem or unmet need
//             will be solved or met by the proposed invention?
//           </p>

//           <div className="tem1-form-container">
//             {[...Array(4)].map((_, index) => (
//               <div
//                 className="tem1-row"
//                 key={index}
//                 style={{ flexDirection: "column" }}
//               >
//                 <div className="tem1-column" style={{ width: "100%" }}>
//                   <label className="tem1-label">
//                     <strong>Why?</strong> Explore a root cause
//                   </label>
//                   <TextField
//                     className="tem1-input"
//                     multiline
//                     size="small"
//                     variant="outlined"
//                     fullWidth
//                     height="20px"
//                     onChange={(e) => onInputChange(e, `why_${index}`)}
//                     value={answers?.[`why_${index}`] || ""}
//                   />
//                 </div>
//                 <div className="tem1-column" style={{ width: "100%" }}>
//                   <label className="tem1-label">
//                     <strong>References</strong>
//                   </label>
//                   <TextField
//                     className="tem1-input"
//                     multiline
//                     minRows={1}
//                     maxRows={1}
//                     size="small"
//                     variant="outlined"
//                     fullWidth
//                     onChange={(e) => onInputChange(e, `references_${index}`)}
//                     value={answers?.[`references_${index}`] || ""}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <Button onClick={handleDownloadScreenshot}>Download Screenshot</Button>
//       </div>
//     </div>
//   );
// };

//export default Template1;

import React from "react";
import { TextField } from "@mui/material";
import Button from "../../Button";
import "../../../CSS/Template1.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const Template1 = ({ answers, onInputChange, canvasId, templateId }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleExportToWord = async () => {
    try {
      // Prepare a clean structure for backend
      const formattedData = [...Array(4)].map((_, index) => ({
        why: answers?.[`why_${index}`] || "",
        references: answers?.[`references_${index}`] || "",
      }));

      const payload = {
        canvasId,
        templateId,
        exportMode: "text", // optional, for clarity
        formattedData,
        heading:
          "What real-world practical problem or unmet need will be solved or met by the proposed invention?",
      };

      const response = await axios.post(
        "http://localhost:5000/api/template/export-text",
        payload,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template1_Export.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting Word document:", error);
    }
  };

  return (
    <div id="template-capture">
      <div className="tem1-container">
        <p className="tem1-description">
          <strong>What</strong> real-world practical problem or unmet need will
          be solved or met by the proposed invention?
        </p>

        <div className="tem1-form-container">
          {[...Array(4)].map((_, index) => (
            <div
              className="tem1-row"
              key={index}
              style={{ flexDirection: "column", marginBottom: "20px" }}
            >
              <div className="tem1-column" style={{ width: "100%" }}>
                <label className="tem1-label">
                  <strong>Why?</strong> Explore a root cause
                </label>
                <TextField
                  className="tem1-input"
                  multiline
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder="Explain the reason behind the problem"
                  onChange={(e) => onInputChange(e, `why_${index}`)}
                  value={answers?.[`why_${index}`] || ""}
                />
              </div>

              <div
                className="tem1-column"
                style={{ width: "100%", marginTop: "10px" }}
              >
                <label className="tem1-label">
                  <strong>References</strong>
                </label>
                <TextField
                  className="tem1-input"
                  multiline
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder="Cite any references or sources"
                  onChange={(e) => onInputChange(e, `references_${index}`)}
                  value={answers?.[`references_${index}`] || ""}
                />
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleExportToWord}>Export to Word (Editable)</Button>
      </div>
    </div>
  );
};

export default Template1;
