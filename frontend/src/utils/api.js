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
