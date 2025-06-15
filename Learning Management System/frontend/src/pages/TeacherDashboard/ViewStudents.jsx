import React, { useEffect, useState } from "react";
import { Table, Typography, Divider } from "antd";
import axios from "axios";

const { Title } = Typography;

const ViewEnrolledStudents = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/courses/teacher/enrollments",
          {
            withCredentials: true,
          }
        );
        setEnrollments(res.data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      }
    };

    fetchEnrollments();
  }, []);

  const columns = [
    {
      title: "Course Title",
      dataIndex: ["course", "title"],
      key: "course",
    },
    {
      title: "Student Name",
      dataIndex: ["student", "name"],
      key: "studentName",
    },
    {
      title: "Student Email",
      dataIndex: ["student", "email"],
      key: "studentEmail",
    },
    {
      title: "Progress (%)",
      dataIndex: "progress",
      key: "progress",
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (completed) => (completed ? "Yes" : "No"),
    },
    {
      title: "Enrolled At",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Enrolled Students</Title>
      <Divider />
      <Table columns={columns} dataSource={enrollments} rowKey="_id" />
    </div>
  );
};

export default ViewEnrolledStudents;
