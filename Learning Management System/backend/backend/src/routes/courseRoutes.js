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
  getCourseById,
  getUnapprovedCourses,
  approveCourse,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", protect, createCourse);

router.get("/", protect, getTeacherCourses);

router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);
router.get("/unapproved", protect, getUnapprovedCourses);
router.put("/approve/:id", protect, approveCourse);

// Admin
router.get("/all", protect, getAllCourses);
router.delete("/admin/:id", protect, deleteCourseAdmin);

// Student
router.get("/approved", getApprovedCourses);
router.get("/:id", protect, getCourseById);

// Teacher (needs auth middleware to identify the teacher)
router.get("/teacher/my-courses", protect, getTeacherCourses);
router.get("/teacher/enrollments", protect, getEnrolledStudentsByTeacher);

module.exports = router;
