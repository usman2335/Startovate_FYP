const axios = require("axios");
const StepDescription = require("../models/StepDescriptions");
const Canvas = require("../models/Canvas");

// FastAPI ChatBot endpoint
const CHATBOT_BASE_URL = "http://127.0.0.1:8000";

/**
 * Parse templateKey to extract component name and step number
 * Example: "ProblemIdentification-Step3" -> { componentName: "Problem Identification", stepNumber: 3 }
 */
const parseTemplateKey = (templateKey) => {
  // Split by "-Step" to get the component part and step number
  const match = templateKey.match(/^(.+)-Step(\d+)$/);

  if (!match) {
    throw new Error(`Invalid templateKey format: ${templateKey}`);
  }

  const componentPart = match[1];
  const stepNumber = parseInt(match[2]);

  // Convert camelCase/PascalCase to space-separated format
  // e.g., "ProblemIdentification" -> "Problem Identification"
  const componentName = componentPart.replace(/([A-Z])/g, " $1").trim();

  return { componentName, stepNumber };
};

/**
 * Send a message to the LCI ChatBot and return the response
 */
exports.sendChatMessage = async (req, res) => {
  try {
    const { query, top_k = 3, canvasId, templateId } = req.body;

    // Validate input
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query cannot be empty",
      });
    }

    // Prepare context-aware request payload
    const requestPayload = {
      query: query.trim(),
      top_k: parseInt(top_k),
    };

    // Add context if available
    if (canvasId) {
      requestPayload.canvasId = canvasId;
    }
    if (templateId) {
      requestPayload.templateId = templateId;
    }

    console.log("Sending context-aware request:", {
      query: requestPayload.query,
      canvasId: requestPayload.canvasId || "none",
      templateId: requestPayload.templateId || "none",
    });

    // Forward request to FastAPI ChatBot
    const response = await axios.post(
      `${CHATBOT_BASE_URL}/chat`,
      requestPayload,
      {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response from FastAPI
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("ChatBot API Error:", error.message);

    // Handle different types of errors
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message:
          "ChatBot service is unavailable. Please make sure the LCI ChatBot backend is running on port 8000.",
        error: "SERVICE_UNAVAILABLE",
      });
    }

    if (error.response) {
      // FastAPI returned an error response
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.detail || "ChatBot service error",
        error: "CHATBOT_ERROR",
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: "Internal server error while processing chat request",
      error: "INTERNAL_ERROR",
    });
  }
};

/**
 * Check the health status of the ChatBot service
 */
exports.checkChatbotHealth = async (req, res) => {
  try {
    const response = await axios.get(`${CHATBOT_BASE_URL}/health`, {
      timeout: 5000, // 5 second timeout for health check
    });

    res.status(200).json({
      success: true,
      data: response.data,
      message: "ChatBot service is healthy",
    });
  } catch (error) {
    console.error("ChatBot Health Check Error:", error.message);

    res.status(503).json({
      success: false,
      message: "ChatBot service is unavailable",
      error: "SERVICE_UNAVAILABLE",
    });
  }
};

/**
 * Get ChatBot configuration and status
 */
exports.getChatbotStatus = async (req, res) => {
  try {
    // Try to get health status
    const healthResponse = await axios.get(`${CHATBOT_BASE_URL}/health`, {
      timeout: 5000,
    });

    res.status(200).json({
      success: true,
      data: {
        status: "online",
        health: healthResponse.data,
        endpoint: CHATBOT_BASE_URL,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: {
        status: "offline",
        endpoint: CHATBOT_BASE_URL,
        timestamp: new Date().toISOString(),
        error: error.message,
      },
    });
  }
};

/**
 * Autofill template fields using AI
 */
exports.autofillFields = async (req, res) => {
  try {
    console.log("=== AUTOFILL FIELDS REQUEST ===");
    console.log("Full request body:", JSON.stringify(req.body, null, 2));

    const {
      canvasId,
      templateKey,
      systemPrompt,
      fieldHints,
      repeatedFields,
      currentAnswers,
      fields,
    } = req.body;

    console.log("Extracted fields:");
    console.log("  - canvasId:", canvasId);
    console.log("  - templateKey:", templateKey);
    console.log("  - systemPrompt:", systemPrompt);
    console.log("  - fieldHints:", JSON.stringify(fieldHints, null, 2));
    console.log("  - repeatedFields:", JSON.stringify(repeatedFields, null, 2));
    console.log("  - currentAnswers:", JSON.stringify(currentAnswers, null, 2));
    console.log("  - fields:", JSON.stringify(fields, null, 2));
    console.log("================================");

    // Validate required fields
    if (!templateKey) {
      return res.status(400).json({
        success: false,
        error: "templateKey is required",
      });
    }

    if (!fieldHints || Object.keys(fieldHints).length === 0) {
      return res.status(400).json({
        success: false,
        error: "fieldHints is required and cannot be empty",
      });
    }

    // Parse templateKey to get component name and step number
    let componentName, stepNumber;
    try {
      const parsed = parseTemplateKey(templateKey);
      componentName = parsed.componentName;
      stepNumber = parsed.stepNumber;
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Fetch step description from database
    const stepDescription = await StepDescription.findOne({
      componentName: componentName,
      stepNumber: stepNumber,
    });

    if (!stepDescription) {
      return res.status(404).json({
        success: false,
        error: `Step description not found for ${componentName} - Step ${stepNumber}`,
      });
    }

    console.log("Fetched step description:", {
      componentName,
      stepNumber,
      description: stepDescription.description,
    });

    // Fetch idea description from canvas if canvasId is provided
    let ideaDescription = "";
    if (canvasId) {
      try {
        const canvas = await Canvas.findById(canvasId);
        if (canvas && canvas.ideaDescription) {
          ideaDescription = canvas.ideaDescription;
          console.log("Fetched idea description:", {
            canvasId,
            ideaDescription: ideaDescription.substring(0, 100) + "...",
          });
        } else {
          console.log("No idea description found for canvas:", canvasId);
        }
      } catch (error) {
        console.warn("Error fetching canvas idea description:", error.message);
        // Continue without idea description
      }
    }

    // Prepare request payload for FastAPI - matches the AutoFillRequest schema
    const requestPayload = {
      templateKey,
      stepDescription: stepDescription.description,
      ideaDescription: ideaDescription,
      fieldHints: fieldHints,
      repeatedFields: repeatedFields || [],
      currentAnswers: currentAnswers || {},
      fields: fields || [],
    };

    console.log("Sending autofill request to FastAPI:", {
      templateKey,
      canvasId: canvasId || "none",
      componentName,
      stepNumber,
      fieldsCount: Object.keys(fieldHints).length,
      hasCurrentAnswers: Object.keys(currentAnswers || {}).length > 0,
      hasIdeaDescription: !!ideaDescription,
    });

    // Send request to FastAPI autofill endpoint
    const response = await axios.post(
      `${CHATBOT_BASE_URL}/chatbot/auto-fill`,
      requestPayload,
      {
        timeout: 60000, // 60 second timeout for AI generation
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Autofill response received:", {
      success: response.data.success,
      hasAnswers: !!response.data.answers,
    });

    // Return the response from FastAPI
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Autofill API Error:", error.message);

    // Handle connection refused error
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error:
          "ChatBot service is unavailable. Please make sure the FastAPI backend is running on port 8000.",
      });
    }

    // Handle timeout error
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        error: "Request timed out. The AI took too long to generate answers.",
      });
    }

    // Handle FastAPI error response
    if (error.response) {
      console.error("FastAPI Error Response:", error.response.data);
      return res.status(error.response.status || 500).json({
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.detail ||
          error.response.data?.message ||
          "ChatBot service error",
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: "Internal server error while processing autofill request",
    });
  }
};
