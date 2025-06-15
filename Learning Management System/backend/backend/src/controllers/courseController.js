const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, instructor, price, videos } =
      req.body;

    const course = new Course({
      title,
      description,
      category,
      instructor, // optional
      price,
      videos, // should be an array of { title, type, url }
    });

    await course.save();

    res.status(201).json({ success: true, message: "Course created", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 1. Admin – Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. Student – Get only approved courses
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: true });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Teacher – Get own courses (assuming teacher ID comes from auth)
exports.getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming middleware sets req.user
    const courses = await Course.find({ instructor: teacherId });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
