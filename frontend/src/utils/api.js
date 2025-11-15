import axios from "axios";

export const saveTemplates = async (canvasId, templateId, answers) => {
  try {
    const reponse = await axios.post(
      "http://localhost:5000/api/template/save",
      {
        canvasId,
        templateId,
        answers,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // throw error;
  }
};

// Chatbot API functions - Updated to use Node.js backend as proxy
const BACKEND_BASE_URL = "http://localhost:5000";

export const sendChatMessage = async (query, topK = 3, context = {}) => {
  try {
    const requestPayload = {
      query,
      top_k: topK,
    };

    // Add context if available
    if (context.canvasId) {
      requestPayload.canvasId = context.canvasId;
    }
    if (context.templateId) {
      requestPayload.templateId = context.templateId;
    }

    console.log("Sending context-aware chat request:", {
      query: requestPayload.query,
      canvasId: requestPayload.canvasId || "none",
      templateId: requestPayload.templateId || "none",
    });

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/chatbot/send-message`,
      requestPayload,
      {
        withCredentials: true, // Include authentication cookies
      }
    );

    if (response.data.success) {
      return response.data.data; // Return the actual chatbot response
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const checkChatbotHealth = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/chatbot/health`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error checking chatbot health:", error);
    throw error;
  }
};

export const getChatbotStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/chatbot/status`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting chatbot status:", error);
    return {
      success: false,
      data: {
        status: "offline",
        endpoint: BACKEND_BASE_URL,
        timestamp: new Date().toISOString(),
        error: error.message,
      },
    };
  }
};

/**
 * Autofill template fields using AI
 * @param {Object} payload - The autofill request payload
 * @param {string} payload.canvasId - Optional canvas ID for context
 * @param {string} payload.templateKey - Required template identifier (e.g., "ProblemIdentification-Step3")
 * @param {string} payload.systemPrompt - Optional system prompt (defaults to LCI context)
 * @param {Object} payload.fieldHints - Required object with field names as keys and descriptions as values
 * @param {Array} payload.repeatedFields - Optional array of repeated field patterns
 * @param {Object} payload.currentAnswers - Required object with current field values
 * @returns {Promise<Object>} - Returns the autofilled answers
 * @note The stepDescription is automatically fetched from the database based on templateKey
 */
export const autofillTemplateFields = async (payload) => {
  try {
    const {
      canvasId,
      templateKey,
      fieldHints,
      repeatedFields,
      currentAnswers,
    } = payload;

    // Validate required fields
    if (!templateKey) {
      throw new Error("templateKey is required");
    }
    if (!fieldHints || Object.keys(fieldHints).length === 0) {
      throw new Error("fieldHints is required and cannot be empty");
    }

    console.log("Sending autofill request:", {
      templateKey,
      canvasId: canvasId || "none",
      fieldsCount: Object.keys(fieldHints).length,
      hasCurrentAnswers: Object.keys(currentAnswers || {}).length > 0,
    });

    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/chatbot/autofill`,
      {
        canvasId,
        templateKey,
        fieldHints,
        repeatedFields: repeatedFields || [],
        currentAnswers: currentAnswers || {},
      },
      {
        withCredentials: true,
        timeout: 60000, // 60 second timeout
      }
    );

    if (response.data.success) {
      console.log("Autofill successful:", response.data.answers);
      return response.data.answers;
    } else {
      throw new Error(response.data.error || "Autofill failed");
    }
  } catch (error) {
    console.error("Error autofilling template fields:", error);

    // Return more specific error messages
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to autofill fields. Please try again.");
    }
  }
};
