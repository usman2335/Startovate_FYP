const express = require("express");
const router = express.Router();
const {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  deleteCourseAdmin,
  getAllCourses,
  getApprovedCourses,
  getEnrolledStudentsByTeacher,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", createCourse);

router.get("/", protect, getTeacherCourses);

router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

// Admin
router.get("/all", protect, getAllCourses);
router.delete("/admin/:id", protect, deleteCourseAdmin);

// Student
router.get("/student/approved", getApprovedCourses);

// Teacher (needs auth middleware to identify the teacher)
router.get("/teacher/my-courses", protect, getTeacherCourses);
router.get("/teacher/enrollments", protect, getEnrolledStudentsByTeacher);

module.exports = router;
