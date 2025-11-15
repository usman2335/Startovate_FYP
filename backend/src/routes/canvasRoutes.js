const express = require("express");
const { createCanvas, getCanvas, updateIdeaDescription } = require("../controllers/canvasController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/createCanvas", protect, createCanvas);
router.get("/getCanvas", protect, getCanvas);
router.put("/updateIdeaDescription", protect, updateIdeaDescription);

module.exports = router;
