import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Table, message } from "antd";
import { Column } from "@ant-design/charts";
import axios from "axios";

const { Title } = Typography;

const TeacherHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/teacher/dashboard", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch teacher dashboard stats");
      });
  }, []);

  if (!stats) return <div>Loading...</div>;

  const columns = [
    { title: "Student", dataIndex: "student", key: "student" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Course", dataIndex: "course", key: "course" },
    { title: "Progress (%)", dataIndex: "progress", key: "progress" },
    {
      title: "Enrolled At",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (dt) => new Date(dt).toLocaleDateString(),
    },
  ];

  const chartConfig = {
    data: stats.courseProgress,
    xField: "course",
    yField: "averageProgress",
    label: {
      position: "middle",
      style: { fill: "#fff" },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    yAxis: { max: 100 },
    height: 300,
    color: "#73c0de",
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Welcome, {stats.userName}!</Title>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card>Total Courses: {stats.totalCourses}</Card>
        </Col>
        <Col span={12}>
          <Card>Total Students Enrolled: {stats.totalStudents}</Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Recent Enrolled Students">
            <Table
              columns={columns}
              dataSource={stats.enrolledStudentsTable.map((e, i) => ({
                ...e,
                key: i,
              }))}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Average Course Progress">
            <Column {...chartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherHome;
