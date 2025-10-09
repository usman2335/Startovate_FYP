const express = require("express");
const router = express.Router();
const {
  enroll,
  getEnrolledCourses,
  getAvailableCourses,
  getStudentDashboardStats,
} = require("../controllers/enrollController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, enroll);
router.get("/my-courses", protect, getEnrolledCourses);
router.get("/available-courses", protect, getAvailableCourses);
router.get("/student/dashboard", protect, getStudentDashboardStats);
module.exports = router;
