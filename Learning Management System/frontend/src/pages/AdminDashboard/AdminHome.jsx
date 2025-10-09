import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Typography, message } from "antd";
import { Pie } from "@ant-design/charts";
import axios from "axios";

const { Title } = Typography;

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/dashboard", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to load dashboard stats");
      });
  }, []);

  if (!stats) return <div>Loading...</div>;
  const { totalCourses, totalStudents, totalTeachers, userRoles, recentUsers } =
    stats;

  const pieConfig = {
    data: userRoles,
    angleField: "count",
    colorField: "role",
    radius: 1,
    label: { type: "inner", offset: "-30%", content: ({ role }) => role },
    height: 250,
    legend: { position: "bottom" },
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      // title: "Joined At",
      // dataIndex: "createdAt",
      // key: "createdAt",
      // render: (dt) => new Date(dt).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Welcome, ${user.name}</Title>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card>Total Courses: {totalCourses}</Card>
        </Col>
        <Col span={8}>
          <Card>Total Students: {totalStudents}</Card>
        </Col>
        <Col span={8}>
          <Card>Total Teachers: {totalTeachers}</Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Recent Users">
            <Table
              columns={columns}
              dataSource={recentUsers.map((u) => ({ ...u, key: u._id }))}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="User Roles Distribution">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
