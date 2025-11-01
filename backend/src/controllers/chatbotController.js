const axios = require("axios");

// FastAPI ChatBot endpoint
const CHATBOT_BASE_URL = "http://localhost:8000";

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
