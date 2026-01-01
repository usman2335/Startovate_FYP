import React from "react";
import { TextField } from "@mui/material";
import Button from "../../Button";
import "../../../CSS/Template1.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const Template1 = ({ answers, onInputChange, canvasId, templateId }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
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
        `${BACKEND_BASE_URL}/api/template/export-text`,
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
        <div className="tem1-description-wrapper">
          <h3 className="tem1-description">
            <span className="tem1-description-highlight">What</span> real-world
            practical problem or unmet need will be solved or met by the
            proposed invention?
          </h3>
        </div>

        <div className="tem1-form-container" data-export-section="text">
          {[...Array(4)].map((_, index) => (
            <div
              className="tem1-row"
              key={index}
              style={{ flexDirection: "column", marginBottom: "20px" }}
            >
              <label className="tem1-label">
                <strong>Why?</strong> Explore a root cause
              </label>
              <TextField
                className="tem1-input"
                multiline
                minRows={3}
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Explain the reason behind the problem"
                onChange={(e) => onInputChange(e, `why_${index}`)}
                value={answers?.[`why_${index}`] || ""}
              />

              <label className="tem1-label" style={{ marginTop: "16px" }}>
                <strong>References</strong>
              </label>
              <TextField
                className="tem1-input"
                multiline
                minRows={3}
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Cite any references or sources"
                onChange={(e) => onInputChange(e, `references_${index}`)}
                value={answers?.[`references_${index}`] || ""}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template1;
