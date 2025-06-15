// controllers/courseController.js
const Course = require("../models/Courses.js");

// POST /api/courses - Add course
const createCourse = async (req, res) => {
  const { title, description, teacherId } = req.body;
  if (!title || !teacherId)
    return res.status(400).json({ error: "Title and teacher are required" });

  try {
    const newCourse = await Course.create({ title, description, teacherId });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/courses - List all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId", "name", "email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/courses/:id - Edit a course
const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/courses/:id - Delete a course
const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
