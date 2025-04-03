const express = require("express");
const { createCanvas, getCanvas } = require("../controllers/canvasController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/createCanvas", protect, createCanvas);
router.get("/getCanvas", protect, getCanvas);

module.exports = router;
