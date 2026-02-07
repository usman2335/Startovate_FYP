const axios = require("axios");
const mongoose = require("mongoose");
const StepDescription = require("../models/StepDescriptions");
const Canvas = require("../models/Canvas");
const ChatHistory = require("../models/ChatHistory");

// FastAPI ChatBot endpoint
const CHATBOT_BASE_URL = process.env.CHATBOT_BASE_URL;
console.log("CHATBOT_BASE_URL:", CHATBOT_BASE_URL);

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
    const { 
      query, 
      top_k = 3, 
      canvasId, 
      templateId,
      templateKey,
      fieldHints,
      currentAnswers 
    } = req.body;

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
    if (templateKey) {
      requestPayload.templateKey = templateKey;
    }

    // Fetch step description if templateKey is provided
    if (templateKey) {
      try {
        const parsed = parseTemplateKey(templateKey);
        const stepDescription = await StepDescription.findOne({
          componentName: parsed.componentName,
          stepNumber: parsed.stepNumber,
        });

        if (stepDescription) {
          requestPayload.stepDescription = stepDescription.description;
          console.log("✅ Added step description to chat context");
        }
      } catch (error) {
        console.warn("Could not fetch step description:", error.message);
        // Continue without step description
      }
    }

    // Fetch idea description from canvas if canvasId is provided
    if (canvasId) {
      try {
        const userIdString = req.user.id || req.user._id;
        const userId = new mongoose.Types.ObjectId(userIdString);
        const canvasObjectId = new mongoose.Types.ObjectId(canvasId);
        
        console.log("🔍 Fetching canvas:", { canvasId: canvasObjectId, userId, userIdType: typeof userId });
        
        // Find canvas that belongs to the current user
        const canvas = await Canvas.findOne({ _id: canvasObjectId, user: userId });
        
        console.log("🔍 Canvas found:", canvas ? "Yes" : "No");
        if (canvas) {
          console.log("🔍 Canvas owner:", canvas.user);
          console.log("🔍 Current user:", userId);
          console.log("🔍 Owner matches:", String(canvas.user) === String(userId));
          console.log("🔍 Has idea:", !!canvas.ideaDescription);
          if (canvas.ideaDescription) {
            console.log("🔍 Idea preview:", canvas.ideaDescription.substring(0, 50) + "...");
          }
        }
        
        if (canvas && canvas.ideaDescription) {
          requestPayload.ideaDescription = canvas.ideaDescription;
          console.log("✅ Added idea description to chat context for user:", userId);
        } else if (!canvas) {
          console.log("⚠️ Canvas not found or doesn't belong to user:", userId);
        } else {
          console.log("⚠️ Canvas found but has no idea description");
        }
      } catch (error) {
        console.error("❌ Error fetching idea description:", error.message);
        console.error("Full error:", error);
        // Continue without idea description
      }
    }

    // Add field hints if provided
    if (fieldHints && Object.keys(fieldHints).length > 0) {
      requestPayload.fieldHints = fieldHints;
      console.log(`✅ Added ${Object.keys(fieldHints).length} field hints to chat context`);
    }

    // Add current answers if provided
    if (currentAnswers && Object.keys(currentAnswers).length > 0) {
      requestPayload.currentAnswers = currentAnswers;
      console.log(`✅ Added ${Object.keys(currentAnswers).length} current answers to chat context`);
    }

    console.log("Sending enriched context-aware request:", {
      query: requestPayload.query,
      canvasId: requestPayload.canvasId || "none",
      templateId: requestPayload.templateId || "none",
      templateKey: requestPayload.templateKey || "none",
      hasStepDescription: !!requestPayload.stepDescription,
      hasIdeaDescription: !!requestPayload.ideaDescription,
      hasFieldHints: !!requestPayload.fieldHints,
      hasCurrentAnswers: !!requestPayload.currentAnswers,
    });

    // Forward request to FastAPI ChatBot
    const response = await axios.post(
      `${CHATBOT_BASE_URL}/chat`,
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Save chat history to database
    try {
      const userIdString = req.user.id || req.user._id; // From auth middleware (JWT stores 'id')
      const userId = new mongoose.Types.ObjectId(userIdString); // Convert to ObjectId
      const canvasObjectId = canvasId ? new mongoose.Types.ObjectId(canvasId) : null;
      
      console.log("💾 Saving chat history for userId:", userId, "canvasId:", canvasObjectId || "null");
      console.log("💾 userId type:", typeof userId, "is ObjectId:", userId instanceof mongoose.Types.ObjectId);
      
      // Find or create chat history for this user/canvas combination
      let chatHistory = await ChatHistory.findOne({
        userId: userId,
        canvasId: canvasObjectId,
      });

      if (!chatHistory) {
        console.log("📝 Creating new chat history document");
        chatHistory = new ChatHistory({
          userId: userId,
          canvasId: canvasObjectId,
          templateKey: templateKey || null,
          messages: [],
        });
      } else {
        console.log("📝 Updating existing chat history (current messages:", chatHistory.messages.length, ")");
      }

      // Add user message
      chatHistory.messages.push({
        role: "user",
        content: query.trim(),
        timestamp: new Date(),
      });

      // Add bot response
      chatHistory.messages.push({
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
      });

      // Update last message timestamp
      chatHistory.lastMessageAt = new Date();
      
      // Update templateKey if provided
      if (templateKey) {
        chatHistory.templateKey = templateKey;
      }

      await chatHistory.save();
      console.log("✅ Chat history saved to database (total messages:", chatHistory.messages.length, ")");
    } catch (historyError) {
      console.error("❌ Warning: Could not save chat history:", historyError.message);
      console.error("Full error:", historyError);
      // Don't fail the request if history save fails
    }

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
 * Get chat history for the current user
 */
exports.getChatHistory = async (req, res) => {
  try {
    const userIdString = req.user.id || req.user._id; // JWT stores 'id'
    const userId = new mongoose.Types.ObjectId(userIdString); // Convert to ObjectId
    const { canvasId } = req.query;
    const canvasObjectId = canvasId ? new mongoose.Types.ObjectId(canvasId) : null;

    console.log("📥 getChatHistory request:", { userId, canvasId: canvasObjectId || "null" });
    console.log("📥 userId type:", typeof userId, "is ObjectId:", userId instanceof mongoose.Types.ObjectId);
    console.log("📥 req.user:", req.user);

    // Build query - if no canvasId provided, look for documents with canvasId: null
    const query = { 
      userId: userId,
      canvasId: canvasObjectId
    };

    console.log("🔍 Querying chat history with:", query);

    // Find chat history, sorted by most recent
    const chatHistory = await ChatHistory.findOne(query).sort({ lastMessageAt: -1 });

    console.log("📊 Found chat history:", chatHistory ? `Yes (${chatHistory.messages.length} messages)` : "No");

    if (!chatHistory) {
      console.log("ℹ️ No chat history found, returning empty");
      return res.status(200).json({
        success: true,
        data: {
          messages: [],
          hasHistory: false,
        },
      });
    }

    console.log("✅ Returning chat history with", chatHistory.messages.length, "messages");
    console.log("📋 First message sample:", chatHistory.messages[0]);
    res.status(200).json({
      success: true,
      data: {
        messages: chatHistory.messages,
        hasHistory: true,
        lastMessageAt: chatHistory.lastMessageAt,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: "INTERNAL_ERROR",
    });
  }
};

/**
 * Clear chat history for the current user
 */
exports.clearChatHistory = async (req, res) => {
  try {
    const userIdString = req.user.id || req.user._id; // JWT stores 'id'
    const userId = new mongoose.Types.ObjectId(userIdString); // Convert to ObjectId
    const { canvasId } = req.body;
    const canvasObjectId = canvasId ? new mongoose.Types.ObjectId(canvasId) : null;

    const query = { userId };
    if (canvasId) {
      query.canvasId = canvasObjectId;
    }

    console.log("🗑️ Clearing chat history for:", query);
    await ChatHistory.deleteMany(query);

    res.status(200).json({
      success: true,
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear chat history",
      error: "INTERNAL_ERROR",
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
      console.log(`🔍 [AUTOFILL] Parsing templateKey: ${templateKey}`);
      const parsed = parseTemplateKey(templateKey);
      componentName = parsed.componentName;
      stepNumber = parsed.stepNumber;
      console.log(`🔍 [AUTOFILL] Parsed result: componentName="${componentName}", stepNumber=${stepNumber}`);
    } catch (error) {
      console.error(`❌ [AUTOFILL] Template key parsing failed: ${error.message}`);
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Use detailed fallback descriptions for all templates (especially Funding templates)
    const fallbackDescriptions = {
      // Funding Templates
      "Funding-Step1": "Total Grant Desired for Research Process - Determine the total funding required for your research project and provide justification for the requested amount. Consider direct costs (equipment, materials, personnel) and indirect costs (overhead, administration).",
      
      "Funding-Step2": "Tangible Resources & Equipment Budget - Budget for physical resources and equipment required for different key deliverables. List all tangible resources needed (lab equipment, materials, hardware, software licenses) and associate each resource with specific key deliverables.",
      
      "Funding-Step3": "Skills & Capacities Budget (Intangible Resources) - Budget for human resources, skills, and expertise required for the research. Identify all roles needed (researchers, technicians, consultants, students) and define the specific skills and capacities required for each role.",
      
      "Funding-Step4": "Visits & Stakeholder Meetings Budget - Budget for travel, visits, and meetings with stakeholders to discover end-user needs and industrial interest. Plan visits to potential end-users, industry partners, and collaborators including conference attendance.",
      
      "Funding-Step5": "Funding with respect to Technology Readiness Level (TRL) - Map funding requirements to different stages of technology development from basic principles (TRL 1) to commercial evaluation (TRL 8). Consider progressive funding as you advance through TRL stages.",
      
      // Market Landscape Templates
      "MarketLandscape-Step1": "Market Mapping and Competitive Landscape Matrix - Analyze competitors, their market size, customer segments, and SWOT/PEST analysis to understand the competitive landscape.",
      
      "MarketLandscape-Step2": "Market Size and Growth Analysis - Evaluate the total addressable market, serviceable addressable market, and compound annual growth rate for your industry sector.",
      
      "MarketLandscape-Step3": "Customer Segment Analysis - Identify and analyze different customer segments, their needs, pain points, and willingness to pay for your solution.",
      
      "MarketLandscape-Step4": "Market Entry Strategy - Develop strategies for entering the market, including positioning, pricing, and go-to-market approaches.",
      
      "MarketLandscape-Step5": "Competitive Advantage Analysis - Identify your unique value proposition and sustainable competitive advantages in the marketplace.",
      
      // Problem Identification Templates
      "ProblemIdentification-Step1": "5 Whys Root Cause Analysis - Use the 5 Whys technique to identify the root causes of problems and gather supporting references.",
      
      "ProblemIdentification-Step2": "Problem Context and Feedback - Document the incident, event, or condition that led to problem identification and gather stakeholder feedback.",
      
      "ProblemIdentification-Step3": "Motivation and Justification - Explain the motivation for addressing this problem and justify why it's worth solving.",
      
      "ProblemIdentification-Step6": "Problem Investigation Script - Conduct structured interviews with stakeholders to validate problems, assess their intensity, and rank them by urgency.",
      
      // Default fallback
      "default": "Template for systematic analysis and documentation of research and business development activities."
    };
    
    const description = fallbackDescriptions[templateKey] || fallbackDescriptions["default"];
    
    console.log(`✅ [AUTOFILL] Using detailed fallback description for ${templateKey}: ${description.substring(0, 100)}...`);

    // Fetch idea description from canvas if canvasId is provided
    let ideaDescription = "";
    if (canvasId) {
      try {
        const userIdString = req.user.id || req.user._id;
        const userId = new mongoose.Types.ObjectId(userIdString);
        const canvasObjectId = new mongoose.Types.ObjectId(canvasId);
        
        console.log("🔍 [AUTOFILL] Fetching canvas:", { canvasId: canvasObjectId, userId, userIdType: typeof userId });
        
        // Find canvas that belongs to the current user
        const canvas = await Canvas.findOne({ _id: canvasObjectId, user: userId });
        
        console.log("🔍 [AUTOFILL] Canvas found:", canvas ? "Yes" : "No");
        if (canvas) {
          console.log("🔍 [AUTOFILL] Canvas owner:", canvas.user);
          console.log("🔍 [AUTOFILL] Current user:", userId);
          console.log("🔍 [AUTOFILL] Owner matches:", String(canvas.user) === String(userId));
          console.log("🔍 [AUTOFILL] Has idea:", !!canvas.ideaDescription);
          if (canvas.ideaDescription) {
            console.log("🔍 [AUTOFILL] Idea preview:", canvas.ideaDescription.substring(0, 50) + "...");
          }
        }
        
        if (canvas && canvas.ideaDescription) {
          ideaDescription = canvas.ideaDescription;
          console.log("✅ [AUTOFILL] Fetched idea description for user:", userId);
        } else if (!canvas) {
          console.log("⚠️ [AUTOFILL] Canvas not found or doesn't belong to user:", userId);
        } else {
          console.log("⚠️ [AUTOFILL] Canvas found but has no idea description");
        }
      } catch (error) {
        console.error("❌ [AUTOFILL] Error fetching canvas idea description:", error.message);
        console.error("Full error:", error);
        // Continue without idea description
      }
    }

    // Prepare request payload for FastAPI - matches the AutoFillRequest schema
    const requestPayload = {
      templateKey,
      stepDescription: description,
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
