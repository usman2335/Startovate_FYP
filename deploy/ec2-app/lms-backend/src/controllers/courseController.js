const Course = require("../models/Course");
const User = require("../models/User");
const StudentCourse = require("../models/StudentCourse");

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, videos } = req.body;
    const instructorId = req.user._id;
    const instructorName = req.user.name;

    const course = new Course({
      title,
      description,
      category,
      instructor: instructorId,
      instructorName,
      price,
      videos,
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
    console.log("=== deleteCourse Debug ===");
    console.log("Request params:", req.params);
    console.log("Request user:", req.user);

    const courseId = req.params.id;
    const teacherId = req.user._id; // Extracted from JWT via protect middleware
    console.log("Course ID:", courseId);
    console.log("Teacher ID:", teacherId);
    console.log("Teacher ID type:", typeof teacherId);

    const course = await Course.findById(courseId);
    console.log("Course found:", course);

    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    console.log("Course instructor:", course.instructor);
    console.log("Course instructor type:", typeof course.instructor);
    console.log("Course instructor toString:", course.instructor.toString());
    console.log("Teacher ID toString:", teacherId.toString());
    console.log(
      "Ownership check (toString):",
      course.instructor.toString() === teacherId.toString()
    );
    console.log(
      "Ownership check (equals):",
      course.instructor.equals(teacherId)
    );

    // Only the instructor who created it can delete it - using Mongoose's equals method
    if (!course.instructor.equals(teacherId)) {
      console.log("Course does not belong to teacher");
      console.log("Expected teacher ID:", teacherId.toString());
      console.log("Actual course instructor ID:", course.instructor.toString());
      return res.status(403).json({
        success: false,
        error: "Unauthorized to delete this course",
      });
    }

    await Course.findByIdAndDelete(courseId);
    console.log("Course deleted successfully");

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while deleting course",
    });
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
    console.log("=== updateCourse Debug ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const courseId = req.params.id;
    const teacherId = req.user._id; // Extracted from JWT in `protect` middleware
    console.log("Course ID:", courseId);
    console.log("Teacher ID:", teacherId);

    // Find course first to verify ownership
    const course = await Course.findById(courseId);
    console.log("Course found:", course);

    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    console.log("Course instructor:", course.instructor);
    console.log("Course instructor type:", typeof course.instructor);
    console.log("Course instructor toString:", course.instructor.toString());
    console.log("Teacher ID toString:", teacherId.toString());
    console.log(
      "Ownership check (toString):",
      course.instructor.toString() === teacherId.toString()
    );
    console.log(
      "Ownership check (equals):",
      course.instructor.equals(teacherId)
    );

    // Verify ownership using Mongoose's equals method
    if (!course.instructor.equals(teacherId)) {
      console.log("Course does not belong to teacher");
      return res.status(403).json({
        success: false,
        error: "Unauthorized to update this course",
      });
    }

    // Update fields (destructure explicitly to prevent unwanted field updates)
    const { title, description, price, category, videos } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;
    course.videos = videos || course.videos;

    const updatedCourse = await course.save();
    console.log("Course updated successfully");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    console.error("Error updating course:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error updating course",
    });
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

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id)
      .populate("instructor", "name email") // populate instructor name & email
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching the course",
    });
  }
};

const getUnapprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: false }).populate(
      "instructor",
      "name email"
    );
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unapproved courses" });
  }
};

const approveCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updated = await Course.findByIdAndUpdate(
      courseId,
      { isApproved: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course approved successfully", course: updated });
  } catch (error) {
    console.error("Error approving course:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    console.log("request", req.body);
    const userId = req.user._id;

    const enrollment = await StudentCourse.findOne({
      student: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found" });
    }
    console.log("percent progress of enrollment:", enrollment.progress);
    console.log("percent progress watched of enrollment:", progress);

    // Only update if new progress is greater
    if (progress > enrollment.progress) {
      console.log("percentententent");
      enrollment.progress = progress;

      if (progress >= 100) {
        enrollment.completed = true;
      }

      await enrollment.save();
    }

    res.status(200).json({ success: true, updated: true });
  } catch (error) {
    console.error("Error updating course progress:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    // Total counts
    const [totalCourses, totalStudents, totalTeachers] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
    ]);

    // User role distribution
    const roles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $project: { _id: 0, role: "$_id", count: 1 } },
    ]);

    // First 5 users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt")
      .lean();

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalTeachers,
        userRoles: roles,
        recentUsers: users,
      },
    });
  } catch (err) {
    console.error("Admin Dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get teacher's courses
    const courses = await Course.find({ instructor: teacherId }).select(
      "_id title"
    );

    const courseIds = courses.map((c) => c._id);
    const courseTitles = {};
    courses.forEach((c) => (courseTitles[c._id] = c.title));

    // Total courses
    const totalCourses = courses.length;

    // Enrolled students (in their courses)
    const enrollments = await StudentCourse.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();

    const enrolledStudentsTable = enrollments.map((entry) => ({
      student: entry.student.name,
      email: entry.student.email,
      course: courseTitles[entry.course],
      progress: entry.progress,
      enrolledAt: entry.enrolledAt,
    }));

    // Total unique students
    const totalStudents = await StudentCourse.distinct("student", {
      course: { $in: courseIds },
    }).then((students) => students.length);

    // Chart: average progress for each course
    const courseProgress = await StudentCourse.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: "$course",
          avgProgress: { $avg: "$progress" },
        },
      },
    ]);

    const chartData = courseProgress.map((item) => ({
      course: courseTitles[item._id] || "Unknown",
      averageProgress: Math.round(item.avgProgress),
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        enrolledStudentsTable,
        courseProgress: chartData,
        userName: req.user.name,
      },
    });
  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  deleteCourseAdmin,
  getAllCourses,
  getApprovedCourses,
  getEnrolledStudentsByTeacher,
  getCourseById,
  getUnapprovedCourses,
  approveCourse,
  updateCourseProgress,
  getAdminDashboardStats,
  getTeacherDashboardStats,
};
