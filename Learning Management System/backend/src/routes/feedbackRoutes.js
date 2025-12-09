const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getCourseFeedback,
  getTeacherFeedback,
  updateFeedback,
  deleteFeedback,
  checkStudentFeedback,
  getStudentFeedback,
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

// Student routes
router.post("/submit", protect, submitFeedback);
router.get("/student/:courseId", protect, checkStudentFeedback);
router.get("/student", protect, getStudentFeedback);
router.put("/update/:feedbackId", protect, updateFeedback);
router.delete("/delete/:feedbackId", protect, deleteFeedback);

// Teacher routes
router.get("/course/:courseId", protect, getCourseFeedback);
router.get("/teacher/all", protect, getTeacherFeedback);

// Debug route for testing
router.get("/debug/courses", protect, async (req, res) => {
  try {
    const Course = require("../models/Course");
    const Feedback = require("../models/Feedback");

    const courses = await Course.find({ instructor: req.user._id });
    const feedback = await Feedback.find()
      .populate("course", "title instructor")
      .populate("student", "name");

    res.json({
      success: true,
      user: req.user,
      courses: courses,
      feedback: feedback,
      courseCount: courses.length,
      feedbackCount: feedback.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
