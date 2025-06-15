import React, { useState } from "react";
import { Card, Button, Input, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const allCourses = [
  {
    id: 1,
    title: "Mastering React with Hooks and Context",
    instructor: "John Doe",
    duration: "3h 45m",
    durationMinutes: 225,
    price: 49.99,
    image: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    title: "Complete Tailwind CSS Guide",
    instructor: "Jane Smith",
    duration: "2h 30m",
    durationMinutes: 150,
    price: 29.99,
    image: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    title: "Node.js and Express for Beginners",
    instructor: "Ali Raza",
    duration: "4h 10m",
    durationMinutes: 250,
    price: 39.99,
    image: "https://picsum.photos/300/200?random=3",
  },
];

const EnrollCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const instructors = [...new Set(allCourses.map((c) => c.instructor))];

  let filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (instructorFilter) {
    filteredCourses = filteredCourses.filter(
      (course) => course.instructor === instructorFilter
    );
  }

  if (sortOption === "price-low-high") {
    filteredCourses.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high-low") {
    filteredCourses.sort((a, b) => b.price - a.price);
  } else if (sortOption === "duration-low-high") {
    filteredCourses.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (sortOption === "duration-high-low") {
    filteredCourses.sort((a, b) => b.durationMinutes - a.durationMinutes);
  }

  return (
    <div className="w-full px-6 sm:px-12 py-10">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Available Courses
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        <div className="w-1/2">
          <Search
            size="large"
            placeholder="Search courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 md:w-[300px]"
          />
        </div>
        <Select
          placeholder="Instructor"
          allowClear
          value={instructorFilter || undefined}
          onChange={(value) => setInstructorFilter(value)}
          className="w-[140px]"
          size="middle"
        >
          {instructors.map((instructor) => (
            <Option key={instructor} value={instructor}>
              {instructor}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Sort by"
          allowClear
          value={sortOption || undefined}
          onChange={(value) => setSortOption(value)}
          className="w-[140px]"
          size="middle"
        >
          <Option value="price-low-high">Price ↑</Option>
          <Option value="price-high-low">Price ↓</Option>
          <Option value="duration-low-high">Duration ↑</Option>
          <Option value="duration-high-low">Duration ↓</Option>
        </Select>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300"
            cover={
              <img
                alt={course.title}
                src={course.image}
                className="h-44 object-cover w-full"
              />
            }
          >
            <div className="flex flex-col justify-between h-full">
              <h3 className="text-lg font-bold mb-1 leading-tight">
                {course.title}
              </h3>

              <div className="flex items-center text-gray-500 text-sm mb-2">
                <UserOutlined className="mr-2" />
                {course.instructor}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>{course.duration}</span>
                <span className="font-semibold">${course.price}</span>
              </div>

              <Button
                type="primary"
                className="bg-[#183e6a] hover:bg-[#122e50] h-11 text-base mt-auto"
                block
              >
                Enroll Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnrollCourses;
