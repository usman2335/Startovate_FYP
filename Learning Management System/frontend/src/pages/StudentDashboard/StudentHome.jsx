import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Table, Tag, message } from "antd";
import { Bar } from "@ant-design/plots";
import axios from "axios";

const { Title } = Typography;

const StudentHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/enroll/student/dashboard", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch student dashboard stats");
      });
  }, []);

  if (!stats) return <div>Loading...</div>;

  const columns = [
    {
      title: "Course",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },
    {
      title: "Instructor",
      dataIndex: "instructorName",
      key: "instructorName",
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (completed) =>
        completed ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
  ];

  const chartConfig = {
    data: stats.chartData,
    xField: "progress",
    yField: "course",
    seriesField: "course",
    color: "#1890ff",
    legend: false,
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    height: 300,
    xAxis: { max: 100, title: { text: "Progress (%)" } },
    yAxis: { label: { autoHide: false } },
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Welcome, {stats.userName}!</Title>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card title="Total Enrolled Courses">{stats.totalEnrolled}</Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={14}>
          <Card title="Current Enrollments">
            <Table
              columns={columns}
              dataSource={stats.tableData.map((row, i) => ({ ...row, key: i }))}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Progress by Course">
            <Bar {...chartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;
