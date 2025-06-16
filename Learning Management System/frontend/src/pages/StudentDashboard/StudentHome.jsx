import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { Line, Bar } from '@ant-design/charts';

const StudentHome = () => {
  // States for data to be populated from backend
  const [activityData, setActivityData] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Line chart – Weekly Activity (Videos Watched)
  const lineConfig = {
    data: activityData,
    xField: 'day',
    yField: 'videos',
    height: 250,
    smooth: true,
    point: { size: 5, shape: 'circle' },
    tooltip: {
      formatter: (datum) => ({
        name: 'Videos Watched',
        value: datum.videos,
      }),
    },
  };

  // Bar chart – Course Completion Progress
  const barConfig = {
    data: courseProgress,
    xField: 'progress',
    yField: 'course',
    height: 250,
    color: '#5B8FF9',
    label: {
      position: 'middle',
      content: (originData) => `${originData.progress}%`,
      style: { fill: '#fff' },
    },
  };

  // Table – Enrolled Courses
  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  // Placeholder for real data fetch
  useEffect(() => {
    // fetch('/api/activity').then(res => res.json()).then(setActivityData);
    // fetch('/api/course-progress').then(res => res.json()).then(setCourseProgress);
    // fetch('/api/enrolled-courses').then(res => res.json()).then(setEnrolledCourses);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Weekly Activity (Videos Watched)">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Course Completion Progress">
            <Bar {...barConfig} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Enrolled Courses">
            <Table columns={columns} dataSource={enrolledCourses} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;
