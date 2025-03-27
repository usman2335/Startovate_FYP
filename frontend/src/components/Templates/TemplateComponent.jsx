import React, { useEffect, useState } from "react";
import templateMapping from "../../content/templateMapping";
import Button from "../Button";
import { saveTemplates } from "../../utils/api";
import axios from "axios";

const TemplateComponent = ({ templateKey, canvasId }) => {
  const DynamicComponent =
    templateMapping[templateKey] ||
    templateMapping["ProblemIdentification-Step1"];

  const [answers, setAnswers] = useState({});

  const handleInputChange = (e, field) => {
    setAnswers((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await saveTemplates(canvasId, templateKey, answers);
      alert("Answers saved successfully!");
    } catch (error) {
      alert("Failed to save answers.");
    }
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
      <div className="tem1-button-group">
        <Button
          label="Reset"
          onClick={() => {}}
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
        />
        <Button
          label="Save"
          padding="10px 20px"
          color="white"
          fontSize="16px"
          width="auto"
          marginTop="10px"
          onClick={handleSave}
        />
      </div>
    </>
  );
};

export default TemplateComponent;
