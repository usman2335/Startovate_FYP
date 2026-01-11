import React, { useEffect, useState } from "react";
import templateMapping from "../../content/templateMapping";
import Button from "../Button";
import { saveTemplates, autofillTemplateFields } from "../../utils/api";
import axios from "axios";
import "../../CSS/TemplateComponent.css";
import { Snackbar, CircularProgress } from "@mui/material";
import { useChatbotContext } from "../../context/chatbotContext";

const TemplateComponent = ({ templateKey, canvasId, hideButtons = false }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const { setContext } = useChatbotContext();

  const mappingEntry =
    templateMapping[templateKey] ||
    templateMapping["ProblemIdentification-Step1"];
  const DynamicComponent = mappingEntry?.component;

  const [answers, setAnswers] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillError, setAutoFillError] = useState("");

  const handleInputChange = (e, field, value) => {
    // If a third parameter is provided, use it (for checkboxes/radio buttons)
    // Otherwise, use e.target.value (for text inputs)
    const inputValue = value !== undefined ? value : e.target.value;
    
    // Special handling for intensity radio buttons in Template6
    if (field.startsWith('intensity_') && templateKey === "ProblemIdentification-Step6") {
      const problemId = field.split('_')[2]; // Extract problem ID
      const intensityType = field.split('_')[1]; // Extract intensity type (high/moderate/low)
      
      setAnswers((prev) => ({
        ...prev,
        [`intensity_high_${problemId}`]: intensityType === 'high' ? inputValue : false,
        [`intensity_moderate_${problemId}`]: intensityType === 'moderate' ? inputValue : false,
        [`intensity_low_${problemId}`]: intensityType === 'low' ? inputValue : false,
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [field]: inputValue }));
    }
  };

  const handleSave = async () => {
    try {
      await saveTemplates(canvasId, templateKey, answers);
      setSnackBarMessage("Template saved successfully");
      setSnackBarOpen(true);
    } catch (error) {
      alert("Failed to save answers.");
    }
  };

  const handleAutoFill = async () => {
    try {
      setIsAutoFilling(true);
      setAutoFillError("");

      // Validate that we have the required data
      if (!canvasId) {
        throw new Error("Canvas ID is required for autofill");
      }

      if (
        !mappingEntry.fieldHints ||
        Object.keys(mappingEntry.fieldHints).length === 0
      ) {
        throw new Error("No field hints available for this template");
      }

      console.log("Starting autofill for:", {
        canvasId,
        templateKey,
        fieldsCount: Object.keys(mappingEntry.fieldHints).length,
      });

      // Prepare the payload
      const payload = {
        canvasId,
        templateKey,
        fieldHints: mappingEntry.fieldHints,
        repeatedFields: mappingEntry.repeatedFields || [],
        currentAnswers: answers,
      };

      // Call the autofill API
      const generatedAnswers = await autofillTemplateFields(payload);

      // Special handling for Template6 intensity fields
      let processedAnswers = { ...generatedAnswers };
      if (templateKey === "ProblemIdentification-Step6") {
        // Convert intensity responses to boolean fields
        for (let i = 1; i <= 8; i++) {
          const intensityKey = `intensity_${i}`;
          if (processedAnswers[intensityKey]) {
            const intensityValue = processedAnswers[intensityKey].toLowerCase();
            // Clear all intensity fields for this problem first
            processedAnswers[`intensity_high_${i}`] = false;
            processedAnswers[`intensity_moderate_${i}`] = false;
            processedAnswers[`intensity_low_${i}`] = false;
            
            // Set the appropriate intensity field
            if (intensityValue.includes('high')) {
              processedAnswers[`intensity_high_${i}`] = true;
            } else if (intensityValue.includes('moderate')) {
              processedAnswers[`intensity_moderate_${i}`] = true;
            } else if (intensityValue.includes('low')) {
              processedAnswers[`intensity_low_${i}`] = true;
            }
            
            // Remove the original intensity field
            delete processedAnswers[intensityKey];
          }
        }
      }

      // Merge generated answers with existing answers
      setAnswers((prev) => ({
        ...prev,
        ...processedAnswers,
      }));

      console.log("Autofill completed successfully:", generatedAnswers);

      // Show success message
      setSnackBarMessage("Fields autofilled successfully based on your idea!");
      setSnackBarOpen(true);
    } catch (error) {
      console.error("Autofill error:", error);
      setAutoFillError(
        error.message || "Failed to autofill. Please try again."
      );
      alert(
        `Autofill Error: ${
          error.message || "Failed to autofill. Please try again."
        }`
      );
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  useEffect(() => {
    if (!canvasId || !templateKey) return;

    // Set chatbot context when template loads - including template-specific data
    const templateData = {
      templateKey,
      fieldHints: mappingEntry.fieldHints || {},
      currentAnswers: answers,
    };
    setContext(canvasId, templateKey, null, templateData);

    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/template/get-template/${canvasId}/${templateKey}`
        );
        if (response.data.success) {
          setAnswers(response.data.template.content);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, [canvasId, templateKey]);

  // Update chatbot context whenever answers change
  useEffect(() => {
    if (!canvasId || !templateKey) return;

    const templateData = {
      templateKey,
      fieldHints: mappingEntry.fieldHints || {},
      currentAnswers: answers,
    };
    setContext(canvasId, templateKey, null, templateData);
  }, [answers]);

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
            width="33%"
            marginTop="10px"
            disabled={isAutoFilling}
          />
          <Button
            label={isAutoFilling ? "Generating..." : "Auto Fill"}
            onClick={handleAutoFill}
            padding="10px 10px"
            color="white"
            fontSize="16px"
            width="33%"
            marginTop="10px"
            disabled={isAutoFilling}
          />
          <Button
            label="Save"
            padding="10px 10px"
            color="white"
            fontSize="16px"
            width="33%"
            marginTop="10px"
            onClick={handleSave}
            disabled={isAutoFilling}
          />
        </div>
      )}
      {isAutoFilling && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress size={30} />
          <p style={{ marginTop: "10px", color: "#666" }}>
            Generating answers based on your idea...
          </p>
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBarOpen}
        onClose={handleClose}
        message={snackBarMessage}
        autoHideDuration={4000}
      />
    </>
  );
};

export default TemplateComponent;
