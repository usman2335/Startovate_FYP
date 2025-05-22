const express = require("express");
const {
  startTemplate,
  saveTemplate,
  getTemplate,
  getAllTemplates,
} = require("../controllers/templateController");
const { exportToDocx } = require("../controllers/exportController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/start", protect, startTemplate);
router.post("/save", protect, saveTemplate);
router.get("/get-template/:canvasId/:templateId", getTemplate);
router.get("/export/:canvasId", getAllTemplates);
router.get("/export/docx/:canvasId", exportToDocx);

module.exports = router;
