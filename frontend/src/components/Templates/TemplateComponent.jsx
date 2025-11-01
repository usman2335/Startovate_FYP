import React, { useEffect, useState } from "react";
import templateMapping from "../../content/templateMapping";
import Button from "../Button";
import { saveTemplates } from "../../utils/api";
import axios from "axios";
import "../../CSS/TemplateComponent.css";
import { Snackbar } from "@mui/material";
import { useChatbotContext } from "../../context/chatbotContext";

const TemplateComponent = ({ templateKey, canvasId, hideButtons = false }) => {
  const { setContext } = useChatbotContext();

  const mappingEntry =
    templateMapping[templateKey] ||
    templateMapping["ProblemIdentification-Step1"];
  const DynamicComponent = mappingEntry?.component;

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

  useEffect(() => {
    if (!canvasId || !templateKey) return;

    // Set chatbot context when template loads
    setContext(canvasId, templateKey, null);

    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/template/get-template/${canvasId}/${templateKey}`
        );
        if (response.data.success) {
          setAnswers(response.data.template.content);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, [canvasId, templateKey, setContext]);

  if (!DynamicComponent) {
    return <div>Invalid template key.</div>;
  }

  return (
    <>
      <DynamicComponent answers={answers} onInputChange={handleInputChange} />

      {!hideButtons && (
        <div className="tem-button-group">
          <Button
            label="Reset"
            onClick={() => setAnswers({})}
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
      />
    </>
  );
};

export default TemplateComponent;
