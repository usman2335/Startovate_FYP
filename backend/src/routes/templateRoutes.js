const express = require("express");
const {
  startTemplate,
  saveTemplate,
  getTemplate,
} = require("../controllers/templateController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();
router.post("/start", protect, startTemplate);
router.post("/save", protect, saveTemplate);
router.get("/get-template/:canvasId/:templateId", getTemplate);

module.exports = router;
