const express = require("express");
const router = express.Router();
const {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", createCourse);

router.get("/", protect, getTeacherCourses);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

// Admin
router.get("/admin/all", protect, courseController.getAllCourses);

// Student
router.get("/student/approved", courseController.getApprovedCourses);

// Teacher (needs auth middleware to identify the teacher)
router.get("/teacher/my-courses", protect, courseController.getTeacherCourses);

module.exports = router;
