const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  // Optional fields:
  progress: {
    type: Number,
    default: 0, // percentage
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("StudentCourse", studentCourseSchema);
