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

  const handleInputChange = (e, field) => {
    setAnswers((prev) => ({ ...prev, [field]: e.target.value }));
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

      // Merge generated answers with existing answers
      setAnswers((prev) => ({
        ...prev,
        ...generatedAnswers,
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

    // Set chatbot context when template loads
    setContext(canvasId, templateKey, null);

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
