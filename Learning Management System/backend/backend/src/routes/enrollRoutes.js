const express = require("express");
const router = express.Router();
const {
  enroll,
  getEnrolledCourses,
  getAvailableCourses,
} = require("../controllers/enrollController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, enroll);
router.get("/my-courses", protect, getEnrolledCourses);
router.get("/available-courses", protect, getAvailableCourses);

module.exports = router;
