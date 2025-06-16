const express = require("express");
const {
  startTemplate,
  saveTemplate,
  getTemplate,
  getAllTemplates,
} = require("../controllers/templateController");
const { exportCanvasAsDocx } = require("../controllers/exportController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/start", protect, startTemplate);
router.post("/save", protect, saveTemplate);
router.get("/get-template/:canvasId/:templateId", getTemplate);
router.get("/export/:canvasId", getAllTemplates);
router.get("/canvas/:canvasId", exportCanvasAsDocx);
//router.get("/canvas/:canvasId", exportCanvasAsDocx);
//router.get("/export/docx/:canvasId", exportHybridDocx);
//router.post("/template/export/docx/:canvasId", exportFromClient);
//router.post("/export/upload", uploadImageFromFrontend);
module.exports = router;
