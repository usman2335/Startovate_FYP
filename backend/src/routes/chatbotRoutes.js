const express = require("express");
const {
  sendChatMessage,
  checkChatbotHealth,
  getChatbotStatus,
  autofillFields,
  getChatHistory,
  clearChatHistory,
} = require("../controllers/chatbotController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected (require authentication)
router.post("/send-message", protect, sendChatMessage);
router.get("/health", protect, checkChatbotHealth);
router.get("/status", protect, getChatbotStatus);
router.post("/autofill", protect, autofillFields);
router.get("/history", protect, getChatHistory);
router.delete("/history", protect, clearChatHistory);

module.exports = router;
