import React, { useState } from "react";
import { Progress, Button, Input, Badge } from "antd";

const { Search } = Input;

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "React for Beginners",
      instructor: "John Doe",
      progress: 45,
      duration: "3h 20m",
      image: "https://picsum.photos/200",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Jane Smith",
      progress: 100,
      duration: "4h 15m",
      image: "https://picsum.photos/200",
    },
    {
      id: 3,
      title: "Tailwind CSS Mastery",
      instructor: "Ali Raza",
      progress: 60,
      duration: "2h 45m",
      image: "https://picsum.photos/200",
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Courses */}
      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between w-full max-w-full mx-auto"
          >
            {/* Course Image */}
            <img
              src={course.image}
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
              <p className="text-sm text-gray-500 mb-1">{course.instructor}</p>

              <div className="flex items-center justify-between mt-2">
                <Progress
                  percent={course.progress}
                  strokeColor="#3f72af"
                  trailColor="#f0f0f0"
                  className="w-3/4"
                />
                <Badge
                  count={course.progress === 100 ? "Completed" : "In Progress"}
                  style={{
                    backgroundColor:
                      course.progress === 100 ? "#52c41a" : "#faad14",
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
            >
              Go to Course
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
