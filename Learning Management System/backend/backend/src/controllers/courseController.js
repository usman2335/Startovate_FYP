const Course = require("../models/Course");
const StudentCourse = require("../models/StudentCourse");

const createCourse = async (req, res) => {
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

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user._id; // Extracted from JWT via protect middleware
    console.log("courseid", courseId);
    console.log("teacherID", teacherId);

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Only the instructor who created it can delete it
    if (course.instructor.toString() !== teacherId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({ error: "Server error while deleting course" });
  }
};

const deleteCourseAdmin = async (req, res) => {
  try {
    const courseId = req.params.id;
    //const teacherId = req.user._id; // Extracted from JWT via protect middleware
    console.log("courseid", courseId);
    //console.log("teacherID", teacherId);

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Only the instructor who created it can delete it
    // if (course.instructor.toString() !== teacherId) {
    //   return res
    //     .status(403)
    //     .json({ error: "Unauthorized to delete this course" });
    // }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({ error: "Server error while deleting course" });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user._id; // comes from JWT via `protect` middleware
    console.log("teacher if:", teacherId);

    const courses = await Course.find({ instructor: teacherId }).populate(
      "instructor",
      "name email"
    );

    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching teacher courses:", err.message);
    res.status(500).json({ error: "Server error fetching courses" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log("id", req.params.id);
    const teacherId = req.user._id; // Extracted from JWT in `protect` middleware
    console.log("teacher id", req.user.id);

    // Find course first to verify ownership
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("instructor", course.instructor.toString());
    console.log("teacher id", teacherId);

    // Update fields (destructure explicitly to prevent unwanted field updates)
    const { title, description, price, category, videos } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;
    course.videos = videos || course.videos;

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error("Error updating course:", err.message);
    res.status(500).json({ error: "Server error updating course" });
  }
};

// 1. Admin – Get all courses
const getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
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
const getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: true });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getEnrolledStudentsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;

    console.log("teacher id", teacherId);
    // Step 1: Find all courses by this teacher
    const teacherCourses = await Course.find({ instructor: teacherId }).select(
      "_id"
    );

    const courseIds = teacherCourses.map((course) => course._id);

    // Step 2: Find all enrollments for these courses
    const enrollments = await StudentCourse.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .populate("course", "title");

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error fetching enrolled students:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// // 3. Teacher – Get own courses (assuming teacher ID comes from auth)
// const getTeacherCourses = async (req, res) => {
//   try {
//     const teacherId = req.user.id; // Assuming middleware sets req.user
//     const courses = await Course.find({ instructor: teacherId });
//     res.status(200).json({ success: true, courses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

module.exports = {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  deleteCourseAdmin,
  getAllCourses,
  getApprovedCourses,
  getEnrolledStudentsByTeacher,
};
