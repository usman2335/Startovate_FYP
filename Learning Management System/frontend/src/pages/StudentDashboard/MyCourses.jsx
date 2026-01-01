import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Input,
  Badge,
  Spin,
  Empty,
  Space,
  notification,
} from "antd";
import { MessageOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";

const { Search } = Input;

const MyCourses = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseFeedbackStatus, setCourseFeedbackStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/enroll/my-courses`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setCourses(res.data.enrolledCourses);
          console.log("courses:", res);

          // Check feedback status for each course
          await checkFeedbackStatus(res.data.enrolledCourses);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("An error occurred while fetching courses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const checkFeedbackStatus = async (courses) => {
    try {
      const feedbackStatus = {};

      for (const course of courses) {
        try {
          const response = await axios.get(
            `${BACKEND_BASE_URL}/api/feedback/student/${course._id}`,
            { withCredentials: true }
          );
          feedbackStatus[course._id] = response.data.hasFeedback;
        } catch (error) {
          // If no feedback exists, it will return 404, which is fine
          feedbackStatus[course._id] = false;
        }
      }

      setCourseFeedbackStatus(feedbackStatus);
    } catch (error) {
      console.error("Error checking feedback status:", error);
    }
  };

  const validCourses = courses.filter((course) => course); // removes null/undefined
  const filteredCourses = validCourses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFeedbackClick = (course) => {
    setSelectedCourse({
      courseId: course._id,
      courseTitle: course.title,
      instructorName: course.instructorName,
    });
    setFeedbackModalVisible(true);
  };

  const handleFeedbackSuccess = (feedbackData) => {
    // Update feedback status for the course
    setCourseFeedbackStatus((prev) => ({
      ...prev,
      [feedbackData.course._id]: true,
    }));

    // Show a success notification
    notification.success({
      message: "Feedback Submitted! 🎉",
      description:
        "Your feedback has been successfully recorded. Thank you for helping improve the course!",
      duration: 4,
      placement: "topRight",
      style: {
        backgroundColor: "#f6ffed",
        border: "1px solid #b7eb8f",
      },
    });

    // Optionally refresh the courses list or show additional success message
    console.log("Feedback submitted successfully");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-10 bg-[#fafafa] min-h-screen">
      <span className="text-heading-2 text-[#1f1f1f] mb-6 block">
        My Courses
      </span>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="w-1/2">
          <Search
            size="large"
            placeholder="Search courses"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredCourses.length === 0 ? (
        <Empty description="No enrolled courses found" />
      ) : (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between w-full max-w-full mx-auto"
            >
              {/* Course Image */}
              <img
                src={course.image || "https://picsum.photos/200"}
                alt={course.title}
                className="w-32 h-20 object-cover rounded-lg mr-4"
              />

              {/* Course Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {course.title}
                  </h2>
                  <span className="text-gray-500">{course.duration}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {course.instructorName}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <Progress
                    percent={course.progress || 0}
                    strokeColor="#3f72af"
                    trailColor="#f0f0f0"
                    className="w-3/4"
                  />
                  <Badge
                    count={
                      (course.progress || 0) === 100
                        ? "Completed"
                        : "In Progress"
                    }
                    style={{
                      backgroundColor:
                        (course.progress || 0) === 100 ? "#52c41a" : "#faad14",
                      marginLeft: 16,
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <Space direction="vertical" size="small">
                <Button
                  type="primary"
                  size="large"
                  className="bg-[#183e6a] hover:bg-[#122e50] px-6"
                  onClick={() => navigate(`/student/mycourses/${course._id}`)}
                >
                  Go to Course
                </Button>
                <Button
                  icon={<MessageOutlined />}
                  size="large"
                  onClick={() => handleFeedbackClick(course)}
                  className="w-full"
                  disabled={courseFeedbackStatus[course._id]}
                  type={
                    courseFeedbackStatus[course._id] ? "default" : "primary"
                  }
                >
                  {courseFeedbackStatus[course._id]
                    ? "Feedback Submitted ✓"
                    : "Submit Feedback"}
                </Button>
              </Space>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedCourse && (
        <FeedbackModal
          visible={feedbackModalVisible}
          onCancel={() => {
            setFeedbackModalVisible(false);
            setSelectedCourse(null);
          }}
          courseId={selectedCourse.courseId}
          courseTitle={selectedCourse.courseTitle}
          instructorName={selectedCourse.instructorName}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
};

export default MyCourses;
