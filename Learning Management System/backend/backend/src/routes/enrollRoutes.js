const express = require("express");
const router = express.Router();
const { enroll } = require("../controllers/enrollController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, enroll);

module.exports = router;
