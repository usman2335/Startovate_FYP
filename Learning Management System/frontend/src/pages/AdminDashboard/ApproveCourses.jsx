import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Descriptions,
  Tag,
  Divider,
} from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const ApproveCourses = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUnapprovedCourses = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/api/courses/unapproved`,
        {
          withCredentials: true,
        }
      );
      setCourses(res.data.courses);
    } catch (error) {
      console.error("Failed to fetch unapproved courses:", error);
      message.error("Failed to load unapproved courses");
    }
  };

  const handleApprove = async (courseId) => {
    try {
      const result = await Swal.fire({
        title: "Approve Course?",
        text: "This will make the course available for students.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Approve",
      });

      if (result.isConfirmed) {
        await axios.put(
          `${BACKEND_BASE_URL}/api/courses/approve/${courseId}`,
          null,
          {
            withCredentials: true,
          }
        );
        message.success("Course approved successfully");
        Swal.fire("Approved!", "Course approved successfully", "success");
        fetchUnapprovedCourses();
      }
    } catch (error) {
      console.error("Approval failed:", error);
      message.error("Failed to approve course");
    }
  };

  const handleViewDetails = async (courseId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/api/courses/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setSelectedCourse(res.data.course);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      message.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
  };

  useEffect(() => {
    fetchUnapprovedCourses();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Instructor",
      dataIndex: ["instructor", "name"],
      key: "instructor",
      render: (_, record) => record.instructor?.name || "N/A",
    },
    {
      title: "Email",
      dataIndex: ["instructor", "email"],
      key: "email",
      render: (_, record) => record.instructor?.email || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={() => handleViewDetails(record._id)}>Details</Button>
          <Button type="primary" onClick={() => handleApprove(record._id)}>
            Approve
          </Button>
        </div>
      ),
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-[#fafafa] min-h-screen">
      <h2 className="text-heading-2 text-[#1f1f1f] mb-6">Unapproved Courses</h2>
      <div className="bg-white rounded-xl shadow-premium p-4 md:p-6">
        <Table columns={columns} dataSource={courses} rowKey="_id" bordered />
      </div>

      <Modal
        title="Course Details"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
          selectedCourse && (
            <Button
              key="approve"
              type="primary"
              onClick={() => {
                handleCloseModal();
                handleApprove(selectedCourse._id);
              }}
            >
              Approve Course
            </Button>
          ),
        ]}
        width={800}
        loading={loading}
      >
        {selectedCourse && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Course Title">
                <strong>{selectedCourse.title}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedCourse.description || "No description provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Instructor Name">
                {selectedCourse.instructor?.name ||
                  selectedCourse.instructorName ||
                  "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Instructor Email">
                {selectedCourse.instructor?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <Tag color="green">${selectedCourse.price || 0}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedCourse.category ? (
                  <Tag color="blue">{selectedCourse.category}</Tag>
                ) : (
                  "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedCourse.isApproved ? "green" : "orange"}>
                  {selectedCourse.isApproved ? "Approved" : "Pending Approval"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDate(selectedCourse.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            {selectedCourse.videos && selectedCourse.videos.length > 0 && (
              <>
                <Divider orientation="left">Course Content</Divider>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {selectedCourse.videos.map((chapter, chapterIndex) => (
                    <div
                      key={chapterIndex}
                      style={{
                        marginBottom: "20px",
                        padding: "12px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <h4 className="text-heading-4 mb-3 text-[#dc2626]">
                        Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                      </h4>
                      {chapter.lessons && chapter.lessons.length > 0 ? (
                        <ul style={{ marginLeft: "20px" }}>
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              style={{ marginBottom: "8px" }}
                            >
                              <strong>{lesson.title}</strong>
                              <br />
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                Type: {lesson.type} | URL:{" "}
                                <a
                                  href={lesson.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {lesson.url}
                                </a>
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: "#999", fontStyle: "italic" }}>
                          No lessons in this chapter
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", color: "#666" }}>
                  <strong>Total Chapters:</strong>{" "}
                  {selectedCourse.videos.length}
                  <br />
                  <strong>Total Lessons:</strong>{" "}
                  {selectedCourse.videos.reduce(
                    (total, chapter) => total + (chapter.lessons?.length || 0),
                    0
                  )}
                </div>
              </>
            )}
            {(!selectedCourse.videos || selectedCourse.videos.length === 0) && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Tag color="orange">No course content available</Tag>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApproveCourses;
