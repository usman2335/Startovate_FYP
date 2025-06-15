const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// POST /api/courses
router.post("/", courseController.createCourse);

module.exports = router;
