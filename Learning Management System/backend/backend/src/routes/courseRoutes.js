const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", courseController.createCourse);

// Admin
router.get("/admin/all", protect, courseController.getAllCourses);

// Student
router.get("/student/approved", courseController.getApprovedCourses);

// Teacher (needs auth middleware to identify the teacher)
router.get("/teacher/my-courses", protect, courseController.getTeacherCourses);

module.exports = router;
