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

exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrolled = await StudentCourse.find({ student: studentId }).populate(
      "course"
    );

    const enrolledCourses = enrolled.map((item) => item.course);

    res.status(200).json({ success: true, enrolledCourses });
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrolled = await StudentCourse.find({ student: studentId }).select(
      "course"
    );

    const enrolledCourseIds = enrolled.map((e) => e.course.toString());

    const availableCourses = await Course.find({
      _id: { $nin: enrolledCourseIds },
    });

    res.status(200).json({ success: true, availableCourses });
  } catch (err) {
    console.error("Error fetching available courses:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
