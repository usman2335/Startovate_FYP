import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { Pie, Column } from '@ant-design/charts';

const AdminHome = () => {
  const [userRolesData, setUserRolesData] = useState([]);
  const [courseApprovalStats, setCourseApprovalStats] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);

  // Pie Chart – User Roles Distribution
  const userRolesConfig = {
    data: userRolesData,
    angleField: 'count',
    colorField: 'role',
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ role }) => role,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    height: 250,
    legend: { position: 'bottom' },
  };

  // Column Chart – Course Approval Stats
  const approvalsConfig = {
    data: courseApprovalStats,
    xField: 'status',
    yField: 'count',
    height: 250,
    color: '#ff9f7f',
    label: {
      position: 'middle',
      content: (originData) => `${originData.count}`,
      style: { fill: '#fff' },
    },
  };

  // Table – Recent Payments
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  useEffect(() => {
    // ⛔ Replace the following with actual API calls
    // Example:
    // fetch('/api/user-roles').then(res => res.json()).then(setUserRolesData);
    // fetch('/api/course-approvals').then(res => res.json()).then(setCourseApprovalStats);
    // fetch('/api/recent-payments').then(res => res.json()).then(setPaymentsData);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="User Distribution by Role">
            <Pie {...userRolesConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Course Approval Status">
            <Column {...approvalsConfig} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Recent Payments">
            <Table columns={columns} dataSource={paymentsData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
