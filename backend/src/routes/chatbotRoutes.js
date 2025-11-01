const express = require("express");
const {
  sendChatMessage,
  checkChatbotHealth,
  getChatbotStatus,
} = require("../controllers/chatbotController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

// All routes are protected (require authentication)
router.post("/send-message", protect, sendChatMessage);
router.get("/health", protect, checkChatbotHealth);
router.get("/status", protect, getChatbotStatus);

module.exports = router;
