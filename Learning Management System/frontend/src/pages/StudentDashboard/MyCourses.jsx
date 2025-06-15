import React, { useState, useEffect } from "react";
import { Progress, Button, Input, Badge, Spin, Empty } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/enroll/my-courses",
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setCourses(res.data.enrolledCourses);
          console.log("courses:", res);
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

  const validCourses = courses.filter((course) => course); // removes null/undefined
  const filteredCourses = validCourses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-8 py-10">
      <span className="text-2xl font-semibold text-gray-800 mb-6 block">
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

              {/* Button */}
              <Button
                type="primary"
                size="large"
                className="ml-4 bg-[#183e6a] hover:bg-[#122e50] px-6"
                onClick={() => navigate(`/student/mycourses/${course._id}`)}
              >
                Go to Course
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
