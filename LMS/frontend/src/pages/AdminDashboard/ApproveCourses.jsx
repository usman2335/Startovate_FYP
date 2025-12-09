import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const ApproveCourses = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);

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
        <Button type="primary" onClick={() => handleApprove(record._id)}>
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Unapproved Courses</h2>
      <Table columns={columns} dataSource={courses} rowKey="_id" bordered />
    </div>
  );
};

export default ApproveCourses;
