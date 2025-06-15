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
