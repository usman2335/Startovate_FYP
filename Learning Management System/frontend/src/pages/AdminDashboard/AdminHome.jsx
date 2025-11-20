import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  message,
  Button,
  Avatar,
  Badge,
  Space,
  Tag,
  Progress,
  Statistic,
  Tooltip,
  Spin,
  Empty,
} from "antd";
import { Pie, Column, Line } from "@ant-design/charts";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
  BellOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const AdminHome = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/users/dashboard`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setStats(response.data.stats);

          // Mock notifications data - replace with actual API call
          setNotifications([
            {
              id: 1,
              type: "user",
              message: "New teacher registered: John Doe",
              time: "2 minutes ago",
              urgent: false,
            },
            {
              id: 2,
              type: "course",
              message: "Course 'Advanced React' needs approval",
              time: "15 minutes ago",
              urgent: true,
            },
            {
              id: 3,
              type: "feedback",
              message: "New feedback received for 'Web Development' course",
              time: "1 hour ago",
              urgent: false,
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="Failed to load dashboard data" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="Loading user data..." />
      </div>
    );
  }

  const { totalCourses, totalStudents, totalTeachers, userRoles, recentUsers } =
    stats;

  // Helper functions
  const getNotificationIcon = (type) => {
    switch (type) {
      case "user":
        return <UserOutlined className="w-4 h-4 text-blue-500" />;
      case "course":
        return <BookOutlined className="w-4 h-4 text-green-500" />;
      case "feedback":
        return <MessageOutlined className="w-4 h-4 text-purple-500" />;
      default:
        return <BellOutlined className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "user":
        return "bg-blue-50 border-blue-200";
      case "course":
        return "bg-green-50 border-green-200";
      case "feedback":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Chart configurations
  const pieConfig = {
    data: userRoles,
    angleField: "count",
    colorField: "role",
    radius: 0.8,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ role, count }) => `${role}: ${count}`,
      style: { fontSize: 12, fontWeight: "bold" },
    },
    height: 300,
    legend: { position: "bottom" },
    color: ["#1890ff", "#52c41a", "#faad14"],
    interactions: [{ type: "element-active" }],
  };

  // Mock data for additional charts
  const enrollmentData = [
    { month: "Jan", students: 120, teachers: 15 },
    { month: "Feb", students: 180, teachers: 18 },
    { month: "Mar", students: 250, teachers: 22 },
    { month: "Apr", students: 320, teachers: 25 },
    { month: "May", students: 400, teachers: 28 },
    { month: "Jun", students: 480, teachers: 30 },
  ];

  const columnConfig = {
    data: enrollmentData,
    xField: "month",
    yField: "students",
    height: 300,
    color: "#1890ff",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  const lineConfig = {
    data: enrollmentData,
    xField: "month",
    yField: "teachers",
    height: 300,
    color: "#52c41a",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colors = {
          student: "blue",
          teacher: "green",
          superadmin: "purple",
        };
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-500 rounded-3xl mx-6 mt-6 mb-8 shadow-xl">
        <div className="px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-xl text-blue-100 mb-4">
                Manage your learning platform with ease
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TrophyOutlined className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-200">System Administrator</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="text-right text-white">
                <div className="text-sm text-blue-100">Quick Actions</div>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/manageusers")}
                    className=" text-blue-600 border-0 hover:bg-blue-50"
                  >
                    Add User
                  </Button>
                  <Button
                    type="primary"
                    icon={<BookOutlined />}
                    onClick={() => navigate("/admin/managecourses")}
                    className="bg-white text-blue-600 border-0 hover:bg-blue-50"
                  >
                    Manage Courses
                  </Button>
                  <Button
                    type="primary"
                    icon={<SettingOutlined />}
                    className="bg-white text-blue-600 border-0 hover:bg-blue-50"
                  >
                    Settings
                  </Button>
                </Space>
              </div> */}
              <Avatar
                size={80}
                className="bg-white bg-opacity-20 border-4 border-white border-opacity-30"
                icon={<UserOutlined className="text-white text-2xl" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="px-6 mb-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <TeamOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-blue-100 text-sm font-medium">
                        Total Teachers
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {totalTeachers}
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <UserOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-green-100 text-sm font-medium">
                        Total Students
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {totalStudents}
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <BookOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-purple-100 text-sm font-medium">
                        Total Courses
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {totalCourses}
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <MessageOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-orange-100 text-sm font-medium">
                        Total Feedbacks
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        24
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* System Analytics Section */}
      <div className="px-6 mb-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChartOutlined className="w-5 h-5 text-blue-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    Student Enrollment Trends
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <Column {...columnConfig} />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PieChartOutlined className="w-5 h-5 text-green-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    User Distribution
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <Pie {...pieConfig} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Management Panels */}
      <div className="px-6 mb-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <UserOutlined className="w-5 h-5 text-indigo-600" />
                    </div>
                    <Title level={4} className="mb-0">
                      Recent Users
                    </Title>
                  </div>
                  <Button
                    type="link"
                    onClick={() => navigate("/admin/manageusers")}
                    className="text-blue-600"
                  >
                    View All →
                  </Button>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <Table
                columns={userColumns}
                dataSource={recentUsers.map((u) => ({ ...u, key: u._id }))}
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BellOutlined className="w-5 h-5 text-purple-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    System Notifications
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <Text className="text-sm font-medium text-gray-800">
                          {notification.message}
                        </Text>
                        <div className="flex items-center justify-between mt-1">
                          <Text className="text-xs text-gray-500">
                            {notification.time}
                          </Text>
                          {notification.urgent && (
                            <Badge status="error" text="Urgent" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="link"
                  className="w-full text-blue-600"
                  icon={<EyeOutlined />}
                >
                  View All Notifications
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Additional Analytics Row */}
      <div className="px-6 mb-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <RiseOutlined className="w-5 h-5 text-teal-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    Teacher Growth
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <Line {...lineConfig} />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <FileTextOutlined className="w-5 h-5 text-pink-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    System Overview
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>System Health</Text>
                  <Progress percent={95} status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Storage Usage</Text>
                  <Progress percent={67} />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Active Sessions</Text>
                  <Progress percent={82} status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Course Completion Rate</Text>
                  <Progress percent={78} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminHome;
