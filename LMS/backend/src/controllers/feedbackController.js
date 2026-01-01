const Feedback = require("../models/Feedback");
const Course = require("../models/Course");
const StudentCourse = require("../models/StudentCourse");
const User = require("../models/User");

// Submit feedback (Student only)
const submitFeedback = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const studentId = req.user._id;

    // Validate required fields
    if (!courseId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: courseId, rating, and comment are required",
      });
    }

    // Verify user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit feedback",
      });
    }

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the student is enrolled in the course
    const enrollment = await StudentCourse.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to submit feedback",
      });
    }

    // Check if feedback already exists for this student and course
    const existingFeedback = await Feedback.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this course",
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      student: studentId,
      course: courseId,
      instructor: course.instructor,
      rating,
      comment,
    });

    await feedback.save();

    // Populate the feedback with student and course details
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting feedback",
    });
  }
};

// Get feedback for a specific course (Teacher only)
const getCourseFeedback = async (req, res) => {
  try {
    console.log("=== getCourseFeedback Debug ===");
    console.log("Request params:", req.params);
    console.log("Request user:", req.user);
    console.log("Request headers:", req.headers);

    const { courseId } = req.params;
    const teacherId = req.user._id;

    console.log("CourseId:", courseId);
    console.log("TeacherId:", teacherId);

    // Verify user is a teacher
    if (req.user.role !== "teacher") {
      console.log("User role is not teacher:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Only teachers can view course feedback",
      });
    }

    // Verify the course exists and belongs to the teacher
    const course = await Course.findById(courseId);
    console.log("Course found:", course);

    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log("Course instructor:", course.instructor);
    console.log("Course instructor type:", typeof course.instructor);
    console.log("Teacher ID:", teacherId);
    console.log("Teacher ID type:", typeof teacherId);
    console.log(
      "Instructor match:",
      course.instructor.toString() === teacherId.toString()
    );

    if (course.instructor.toString() !== teacherId.toString()) {
      console.log("Course does not belong to teacher");
      return res.status(403).json({
        success: false,
        message: "You can only view feedback for your own courses",
      });
    }

    // Get all feedback for this course
    const feedback = await Feedback.find({ course: courseId })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    console.log("Feedback found:", feedback.length, "items");

    // Calculate average rating
    const averageRating =
      feedback.length > 0
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        : 0;

    console.log("Average rating:", averageRating);

    res.status(200).json({
      success: true,
      feedback,
      averageRating: Math.round(averageRating * 10) / 10,
      totalFeedback: feedback.length,
    });
  } catch (error) {
    console.error("Error fetching course feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
    });
  }
};

// Get all feedback for teacher's courses (Teacher only)
const getTeacherFeedback = async (req, res) => {
  try {
    console.log("=== getTeacherFeedback Debug ===");
    console.log("Request user:", req.user);
    console.log("Request headers:", req.headers);

    const teacherId = req.user._id;
    console.log("TeacherId:", teacherId);

    // Verify user is a teacher
    if (req.user.role !== "teacher") {
      console.log("User role is not teacher:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Only teachers can view feedback",
      });
    }

    // Get all courses by this teacher
    console.log("Searching for courses with instructor:", teacherId);
    console.log("TeacherId type:", typeof teacherId);

    const teacherCourses = await Course.find({ instructor: teacherId }).select(
      "_id title instructor"
    );
    console.log("Teacher courses found:", teacherCourses);
    console.log("Number of courses found:", teacherCourses.length);

    const courseIds = teacherCourses.map((course) => course._id);
    console.log("Course IDs:", courseIds);

    // Get all feedback for these courses
    const feedback = await Feedback.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    console.log("All feedback found:", feedback.length, "items");

    // Group feedback by course
    const feedbackByCourse = {};
    teacherCourses.forEach((course) => {
      const courseIdStr = course._id.toString();
      feedbackByCourse[courseIdStr] = {
        courseTitle: course.title,
        feedback: [],
        averageRating: 0,
        totalFeedback: 0,
      };
      console.log(
        "Created feedbackByCourse entry for:",
        courseIdStr,
        "with title:",
        course.title
      );
    });

    feedback.forEach((f) => {
      const courseId = f.course._id.toString();
      console.log("Processing feedback for courseId:", courseId);
      console.log(
        "Available courseIds in feedbackByCourse:",
        Object.keys(feedbackByCourse)
      );

      if (feedbackByCourse[courseId]) {
        feedbackByCourse[courseId].feedback.push(f);
        console.log("Added feedback to course:", courseId);
      } else {
        console.log("CourseId not found in feedbackByCourse:", courseId);
      }
    });

    // Calculate average ratings for each course
    Object.keys(feedbackByCourse).forEach((courseId) => {
      const courseFeedback = feedbackByCourse[courseId].feedback;
      if (courseFeedback.length > 0) {
        const avgRating =
          courseFeedback.reduce((sum, f) => sum + f.rating, 0) /
          courseFeedback.length;
        feedbackByCourse[courseId].averageRating =
          Math.round(avgRating * 10) / 10;
        feedbackByCourse[courseId].totalFeedback = courseFeedback.length;
      }
    });

    console.log("Final feedbackByCourse:", feedbackByCourse);

    res.status(200).json({
      success: true,
      feedbackByCourse,
      totalFeedback: feedback.length,
    });
  } catch (error) {
    console.error("Error fetching teacher feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
    });
  }
};

// Update feedback (Student only - can update their own feedback)
const updateFeedback = async (req, res) => {
  try {
    console.log("=== updateFeedback Debug ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const { feedbackId } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user._id;

    console.log("FeedbackId:", feedbackId);
    console.log("StudentId:", studentId);
    console.log("New rating:", rating);
    console.log("New comment:", comment);

    // Verify user is a student
    if (req.user.role !== "student") {
      console.log("User role is not student:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Only students can update feedback",
      });
    }

    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    console.log("Feedback found:", feedback);

    if (!feedback) {
      console.log("Feedback not found for ID:", feedbackId);
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    console.log("Feedback student:", feedback.student);
    console.log("Feedback student type:", typeof feedback.student);
    console.log("Student ID:", studentId);
    console.log("Student ID type:", typeof studentId);
    console.log("Student ID toString:", studentId.toString());
    console.log("Feedback student toString:", feedback.student.toString());
    console.log(
      "Ownership check (toString):",
      feedback.student.toString() === studentId.toString()
    );
    console.log(
      "Ownership check (equals):",
      feedback.student.equals(studentId)
    );

    // Verify the feedback belongs to the student using Mongoose's equals method
    if (!feedback.student.equals(studentId)) {
      console.log("Feedback does not belong to student");
      console.log("Expected student ID:", studentId.toString());
      console.log("Actual feedback student ID:", feedback.student.toString());
      return res.status(403).json({
        success: false,
        message: "You can only update your own feedback",
      });
    }

    // Update the feedback
    feedback.rating = rating;
    feedback.comment = comment;
    feedback.updatedAt = Date.now();

    await feedback.save();
    console.log("Feedback updated successfully");

    // Populate the updated feedback
    const updatedFeedback = await Feedback.findById(feedbackId)
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name");

    console.log("Updated feedback with population:", updatedFeedback);

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating feedback",
    });
  }
};

// Delete feedback (Student only - can delete their own feedback)
const deleteFeedback = async (req, res) => {
  try {
    console.log("=== deleteFeedback Debug ===");
    console.log("Request params:", req.params);
    console.log("Request user:", req.user);

    const { feedbackId } = req.params;
    const studentId = req.user._id;

    console.log("FeedbackId:", feedbackId);
    console.log("StudentId:", studentId);

    // Verify user is a student
    if (req.user.role !== "student") {
      console.log("User role is not student:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Only students can delete feedback",
      });
    }

    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    console.log("Feedback found:", feedback);

    if (!feedback) {
      console.log("Feedback not found for ID:", feedbackId);
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    console.log("Feedback student:", feedback.student);
    console.log("Feedback student type:", typeof feedback.student);
    console.log("Student ID:", studentId);
    console.log("Student ID type:", typeof studentId);
    console.log("Student ID toString:", studentId.toString());
    console.log("Feedback student toString:", feedback.student.toString());
    console.log(
      "Ownership check (toString):",
      feedback.student.toString() === studentId.toString()
    );
    console.log(
      "Ownership check (equals):",
      feedback.student.equals(studentId)
    );

    // Verify the feedback belongs to the student using Mongoose's equals method
    if (!feedback.student.equals(studentId)) {
      console.log("Feedback does not belong to student");
      console.log("Expected student ID:", studentId.toString());
      console.log("Actual feedback student ID:", feedback.student.toString());
      return res.status(403).json({
        success: false,
        message: "You can only delete your own feedback",
      });
    }

    await Feedback.findByIdAndDelete(feedbackId);
    console.log("Feedback deleted successfully");

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting feedback",
    });
  }
};

// Check if student has submitted feedback for a specific course
const checkStudentFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Verify user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can check feedback status",
      });
    }

    // Check if feedback exists
    const feedback = await Feedback.findOne({
      student: studentId,
      course: courseId,
    });

    res.status(200).json({
      success: true,
      hasFeedback: !!feedback,
      feedback: feedback || null,
    });
  } catch (error) {
    console.error("Error checking student feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking feedback status",
    });
  }
};

// Get all feedback submitted by a student
const getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Verify user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their own feedback",
      });
    }

    // Get all feedback by this student
    const feedback = await Feedback.find({ student: studentId })
      .populate("course", "title instructorName")
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedback,
      totalFeedback: feedback.length,
    });
  } catch (error) {
    console.error("Error fetching student feedback:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student feedback",
    });
  }
};

module.exports = {
  submitFeedback,
  getCourseFeedback,
  getTeacherFeedback,
  updateFeedback,
  deleteFeedback,
  checkStudentFeedback,
  getStudentFeedback,
};
