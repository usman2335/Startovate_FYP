import React, { useEffect, useState } from "react";
import { Card, Button, Input, Select, Spin, Modal, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import PaymentModal from "../../components/PaymentModal";

const { Search } = Input;
const { Option } = Select;

const EnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/enroll/available-courses",
          { withCredentials: true }
        );
        console.log(res.data); // Good for debugging

        const formatted = res.data.availableCourses.map((course) => ({
          ...course,
          id: course._id,
          instructor:
            typeof course.instructor === "string"
              ? "Unknown"
              : course.instructor?.name || "Unknown",
          duration: course.duration || "3h",
          durationMinutes: course.durationMinutes || 180,
          image:
            course.image ||
            `https://picsum.photos/300/200?random=${Math.floor(
              Math.random() * 1000
            )}`,
        }));

        setCourses(formatted);
        setFilteredCourses(formatted);
        setLoading(false);
      } catch (error) {
        message.error("Failed to load available courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort
  useEffect(() => {
    let temp = [...courses];

    if (searchTerm) {
      temp = temp.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (instructorFilter) {
      temp = temp.filter((course) => course.instructor === instructorFilter);
    }

    if (sortOption === "price-low-high") {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      temp.sort((a, b) => b.price - a.price);
    } else if (sortOption === "duration-low-high") {
      temp.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortOption === "duration-high-low") {
      temp.sort((a, b) => b.durationMinutes - a.durationMinutes);
    }

    setFilteredCourses(temp);
  }, [searchTerm, instructorFilter, sortOption, courses]);

  const instructors = [...new Set(courses.map((c) => c.instructor))];

  const showModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

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

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300 w-4/5"
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

                <div className="flex gap-2 mt-auto">
                  <Button
                    onClick={() => showModal(course)}
                    className="h-10 text-base rounded-full w-1/2"
                  >
                    View Details
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleEnrollClick(course)}
                    className="bg-[#183e6a] hover:bg-[#122e50] h-10 text-base rounded-full w-full"
                  >
                    {course.price === 0 ? "Enroll Now (Free)" : `Enroll Now`}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        title={selectedCourse?.title}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        {selectedCourse && (
          <>
            <p>
              <strong>Instructor:</strong> {selectedCourse.instructor}
            </p>
            <p>
              <strong>Price:</strong> ${selectedCourse.price}
            </p>
            <p>
              <strong>Category:</strong> {selectedCourse.category || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedCourse.description || "No description available."}
            </p>
            <ul className="mt-3">
              {selectedCourse.videos?.map((video, index) => (
                <li key={index}>
                  ▶ {video.title} ({video.type})
                </li>
              ))}
            </ul>

            {/* Preview YouTube video */}
            {selectedCourse.videos?.[0]?.type === "youtube" && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="250"
                  src={selectedCourse.videos[0].url.replace(
                    "watch?v=",
                    "embed/"
                  )}
                  title="Course Preview"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </>
        )}
      </Modal>
      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default EnrollCourses;
