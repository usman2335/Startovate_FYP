const StudentCourse = require("../models/StudentCourse");
const Course = require("../models/Course");

exports.enroll = async (req, res) => {
  const userId = req.user._id; // Assuming auth middleware adds req.user
  console.log(userId.id);
  const { courseId } = req.body;

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const existing = await StudentCourse.findOne({
      student: userId,
      course: courseId,
    });

    if (existing) return res.status(400).json({ message: "Already enrolled" });

    // Create new enrollment
    await StudentCourse.create({
      student: userId,
      course: courseId,
    });

    res.status(200).json({ success: true, message: "Enrollment successful" });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
