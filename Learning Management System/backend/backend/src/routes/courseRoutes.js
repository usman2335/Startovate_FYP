const express = require("express");
const router = express.Router();
const {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getApprovedCourses,
  getEnrolledStudentsByTeacher,
  getCourseById,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", protect, createCourse);

router.get("/", protect, getTeacherCourses);

router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

// Admin
router.get("/all", protect, getAllCourses);

// Student
router.get("/student/approved", getApprovedCourses);
router.get("/:id", protect, getCourseById);

// Teacher (needs auth middleware to identify the teacher)
router.get("/teacher/my-courses", protect, getTeacherCourses);
router.get("/teacher/enrollments", protect, getEnrolledStudentsByTeacher);

module.exports = router;
