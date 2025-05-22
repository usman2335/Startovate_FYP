const express = require("express");
const {
  startTemplate,
  saveTemplate,
  getTemplate,
} = require("../controllers/templateController");

const { exportTemplateWord } = require("../controllers/exportController"); // 👈 Import export controller
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, startTemplate);
router.post("/save", protect, saveTemplate);
router.get("/get-template/:canvasId/:templateId", getTemplate);

// 👇 Add this new route for exporting the Word document
router.get("/export/:canvasId/:templateId", protect, exportTemplateWord);

module.exports = router;
