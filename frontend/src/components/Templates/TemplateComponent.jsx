import React, { useEffect, useState } from "react";
import templateMapping from "../../content/templateMapping";
import Button from "../Button";
import { saveTemplates } from "../../utils/api";
import axios from "axios";
import "../../CSS/TemplateComponent.css";
import { Snackbar } from "@mui/material";

const TemplateComponent = ({ templateKey, canvasId, hideButtons = false }) => {
  const DynamicComponent =
    templateMapping[templateKey] ||
    templateMapping["ProblemIdentification-Step1"];

  const [answers, setAnswers] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleInputChange = (e, field) => {
    setAnswers((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await saveTemplates(canvasId, templateKey, answers);
      setSnackBarOpen(true);
    } catch (error) {
      alert("Failed to save answers.");
    }
  };
  const handleClose = () => {
    setSnackBarOpen(false);
  };
  console.log("Passing Props:", { canvasId, templateKey });
  useEffect(() => {
    console.log("useEffect triggered:", { canvasId, templateKey });

    if (!canvasId || !templateKey) return;
    const fetchTemplate = async () => {
      console.log("canvasId:", canvasId, "templateId:", templateKey);
      try {
        console.log("correctly fetching id");
        const response = await axios.get(
          `http://localhost:5000/api/template/get-template/${canvasId}/${templateKey}`
        );
        if (response.data.success) {
          setAnswers(response.data.template.content); // Load saved answers
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    if (canvasId && templateKey) {
      fetchTemplate();
    }
  }, [canvasId, templateKey]);

  return (
    <>
      <DynamicComponent answers={answers} onInputChange={handleInputChange} />

      {!hideButtons && (
        <div className="tem-button-group">
          <Button
            label="Reset"
            onClick={() => {}}
            padding="10px 10px"
            color="white"
            fontSize="16px"
            width="50%"
            marginTop="10px"
          />
          <Button
            label="Save"
            padding="10px 10px"
            color="white"
            fontSize="16px"
            width="50%"
            marginTop="10px"
            onClick={handleSave}
          />
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBarOpen}
        onClose={handleClose}
        message="Template saved successfully"
        // key={vertical + horizontal}
      />
    </>
  );
};

export default TemplateComponent;
