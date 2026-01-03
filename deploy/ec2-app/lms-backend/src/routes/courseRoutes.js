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
  updateCourseProgress,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// POST /api/courses
router.post("/", protect, createCourse);

router.get("/", protect, getTeacherCourses);
router.put("/update/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);
router.get("/unapproved", protect, getUnapprovedCourses);
router.put("/approve/:id", protect, approveCourse);

// ✅ MOVE THIS UP BEFORE /:id
router.put("/progress", protect, updateCourseProgress);

// Admin
router.get("/all", protect, getAllCourses);
router.delete("/admin/:id", protect, deleteCourseAdmin);

// Student
router.get("/approved", getApprovedCourses);

// ✅ KEEP THIS AT THE END
router.get("/:id", getCourseById);

// Teacher
router.get("/teacher/my-courses", protect, getTeacherCourses);
router.get("/teacher/enrollments", protect, getEnrolledStudentsByTeacher);

module.exports = router;
