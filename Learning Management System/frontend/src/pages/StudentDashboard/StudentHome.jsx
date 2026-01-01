import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Button,
  Avatar,
  Badge,
  Spin,
  Empty,
} from "antd";
import {
  BookOutlined,
  StarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalendarOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  CrownOutlined,
  TeamOutlined,
  BarChartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const StudentHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_BASE_URL}/api/enroll/student/dashboard`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setStats(res.data.stats);
        // Mock announcements data - replace with actual API call
        setAnnouncements([
          {
            id: 1,
            title: "New Course Available",
            message:
              "Advanced React Development course is now available for enrollment!",
            type: "course",
            date: "2024-01-15",
            urgent: false,
          },
          {
            id: 2,
            title: "Assignment Deadline",
            message:
              "Web Development Project submission deadline is tomorrow at 11:59 PM",
            type: "deadline",
            date: "2024-01-16",
            urgent: true,
          },
          {
            id: 3,
            title: "Live Session",
            message:
              "Join our live Q&A session with industry experts this Friday at 3 PM",
            type: "event",
            date: "2024-01-19",
            urgent: false,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case "course":
        return <BookOutlined className="w-5 h-5 text-[#dc2626]" />;
      case "deadline":
        return <ClockCircleOutlined className="w-5 h-5 text-[#dc2626]" />;
      case "event":
        return <CalendarOutlined className="w-5 h-5 text-[#b91c1c]" />;
      default:
        return <BellOutlined className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAnnouncementColor = (type) => {
    switch (type) {
      case "course":
        return "bg-blue-50 border-blue-200";
      case "deadline":
        return "bg-red-50 border-red-200";
      case "event":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#dc2626] to-[#b91c1c] rounded-2xl mx-4 md:mx-6 mt-4 md:mt-6 mb-6 md:mb-8 shadow-premium-red animate-fade-in-up">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 md:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="text-white mb-4 md:mb-0">
              <h1 className="text-heading-1 text-white mb-2">
                {getGreeting()}, {stats.userName}!
              </h1>
              <p className="text-xl text-red-100 mb-4">
                Continue learning and track your progress
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RiseOutlined className="w-5 h-5 text-green-300" />
                  <span className="text-green-200">
                    Keep up the great work!
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-float">
                <BookOutlined className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="px-6 mb-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-blue-500 to-blue-600 border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <BookOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-blue-100 text-sm font-medium">
                        Enrolled Courses
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {stats.totalEnrolled || 0}
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-green-500 to-green-600 border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <StarOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-green-100 text-sm font-medium">
                        Avg Rating
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        4.8
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-purple-500 to-purple-600 border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <ClockCircleOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-purple-100 text-sm font-medium">
                        Study Time
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        24h
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover-lift bg-gradient-to-br from-orange-500 to-orange-600 border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <TrophyOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-orange-100 text-sm font-medium">
                        Achievements
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        12
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="px-6 pb-8">
        <Row gutter={[24, 24]}>
          {/* Enrolled Courses Section */}
          <Col xs={24} lg={16}>
            <Card
              className="h-full shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOutlined className="w-5 h-5 text-blue-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    My Courses
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              {stats.tableData && stats.tableData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.tableData.map((course, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {course.courseTitle}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            Instructor: {course.instructorName}
                          </p>
                          <div className="flex items-center space-x-2 mb-3">
                            <Progress
                              percent={Math.random() * 100}
                              size="small"
                              strokeColor="#3b82f6"
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500">
                              {Math.floor(Math.random() * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Avatar
                            size={48}
                            className="bg-gradient-to-br from-blue-500 to-purple-600"
                          >
                            <BookOutlined className="w-6 h-6 text-white" />
                          </Avatar>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {course.completed ? (
                            <Badge status="success" text="Completed" />
                          ) : (
                            <Badge status="processing" text="In Progress" />
                          )}
                        </div>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlayCircleOutlined className="w-4 h-4" />}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
                          onClick={() => navigate("/student/mycourses")}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOutlined className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Title level={4} className="text-gray-500">
                    No courses enrolled yet
                  </Title>
                  <Text className="text-gray-400 mb-4">
                    Start your learning journey by enrolling in courses
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                    onClick={() => navigate("/student/enroll")}
                  >
                    Browse Courses
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* Announcements Section */}
          <Col xs={24} lg={8}>
            <Card
              className="h-full shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BellOutlined className="w-5 h-5 text-green-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    Announcements
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-xl border ${getAnnouncementColor(
                      announcement.type
                    )} hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start space-x-3">
                      {getAnnouncementIcon(announcement.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {announcement.title}
                          </h4>
                          {announcement.urgent && (
                            <Badge status="error" text="Urgent" />
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mb-2">
                          {announcement.message}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(announcement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24} sm={8}>
            <Card
              className="text-center hover-lift cursor-pointer border-0 rounded-2xl"
              onClick={() => navigate("/student/feedback")}
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageOutlined className="w-8 h-8 text-white" />
                </div>
                <Title level={4} className="mb-2">
                  My Feedback
                </Title>
                <Text className="text-gray-600">
                  View and manage your course feedback
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              className="text-center hover-lift cursor-pointer border-0 rounded-2xl"
              onClick={() => navigate("/student/enroll")}
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOutlined className="w-8 h-8 text-white" />
                </div>
                <Title level={4} className="mb-2">
                  Browse Courses
                </Title>
                <Text className="text-gray-600">
                  Discover new courses to enroll in
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              className="text-center hover-lift cursor-pointer border-0 rounded-2xl"
              onClick={() => navigate("/student/mycourses")}
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChartOutlined className="w-8 h-8 text-white" />
                </div>
                <Title level={4} className="mb-2">
                  Progress
                </Title>
                <Text className="text-gray-600">
                  Track your learning progress
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StudentHome;
