import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { Bar, Pie } from '@ant-design/charts';

const TeacherHome = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseRatings, setCourseRatings] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  // Donut chart – Enrollment per course
  const donutConfig = {
    data: enrollmentData,
    angleField: 'students',
    colorField: 'course',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      content: '{name} ({value})',
    },
    height: 250,
    legend: { position: 'bottom' },
  };

  // Bar chart – Average course ratings
  const ratingConfig = {
    data: courseRatings,
    xField: 'rating',
    yField: 'course',
    layout: 'horizontal',
    height: 250,
    color: '#95de64',
    label: {
      position: 'right',
      content: (originData) => `${originData.rating}/5`,
      style: { fill: '#000' },
    },
  };

  // Table – My Courses
  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
  ];

  useEffect(() => {
    // TODO: Fetch from backend and update states

    // Example:
    // fetch('/api/teacher/enrollments')
    //   .then(res => res.json())
    //   .then(setEnrollmentData);

    // fetch('/api/teacher/course-ratings')
    //   .then(res => res.json())
    //   .then(setCourseRatings);

    // fetch('/api/teacher/my-courses')
    //   .then(res => res.json())
    //   .then(setMyCourses);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Student Enrollment per Course">
            <Pie {...donutConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Average Course Ratings">
            <Bar {...ratingConfig} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="My Courses">
            <Table columns={columns} dataSource={myCourses} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherHome;
