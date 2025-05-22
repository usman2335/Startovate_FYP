import React from "react";
import { TextField } from "@mui/material";
import Button from "../../Button";
import "../../../CSS/Template1.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const Template1 = ({ answers, onInputChange, canvasId, templateId }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const downloadWord = async () => {
    // const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

    // if (!token) {
    //   console.error("No token found.");
    //   return;
    // }

    try {
      console.log("canvasId:", canvasId);
      console.log("templateId:", templateId);
      const response = await axios.get(
        `http://localhost:5000/api/template/export/${canvasId}/${templateId}`,
        // { canvasId: canvasId, templateId: templateId },
        { withCredentials: true }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template1_export.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting Word document:", error);
    }
  };

  return (
    <div className="tem1-container">
      <p className="tem1-description">
        <strong>What</strong> real-world practical problem or unmet need will be
        solved or met by the proposed invention?
      </p>

      <div className="tem1-form-container">
        {[...Array(4)].map((_, index) => (
          <div
            className="tem1-row"
            key={index}
            style={{ flexDirection: "column" }}
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
                height="20px"
                onChange={(e) => onInputChange(e, `why_${index}`)}
                value={answers?.[`why_${index}`] || ""}
              />
            </div>
            <div className="tem1-column" style={{ width: "100%" }}>
              <label className="tem1-label">
                <strong>References</strong>
              </label>
              <TextField
                className="tem1-input"
                multiline
                minRows={1}
                maxRows={1}
                size="small"
                variant="outlined"
                fullWidth
                onChange={(e) => onInputChange(e, `references_${index}`)}
                value={answers?.[`references_${index}`] || ""}
              />
            </div>
          </div>
        ))}
        <Button onClick={downloadWord}>Export to Word</Button>
      </div>
    </div>
  );
};

export default Template1;
