import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  message,
  Button,
  Avatar,
  Rate,
  Progress,
  Statistic,
  Space,
  Tag,
  Spin,
  Empty,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const TeacherHome = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch main dashboard stats
        const statsResponse = await axios.get(
          `${BACKEND_BASE_URL}/api/users/teacher/dashboard`,
          {
            withCredentials: true,
          }
        );

        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        }

        // Fetch feedback stats
        try {
          const feedbackResponse = await axios.get(
            `${BACKEND_BASE_URL}/api/feedback/teacher/all`,
            {
              withCredentials: true,
            }
          );

          if (feedbackResponse.data.success) {
            setFeedbackStats(feedbackResponse.data);
          }
        } catch (error) {
          console.log("No feedback data available yet");
        }

        // Fetch recent courses
        try {
          const coursesResponse = await axios.get(
            `${BACKEND_BASE_URL}/api/courses/teacher/my-courses`,
            {
              withCredentials: true,
            }
          );

          if (coursesResponse.data && coursesResponse.data.length > 0) {
            setRecentCourses(coursesResponse.data.slice(0, 5)); // Get first 5 courses
          }
        } catch (error) {
          console.log("No courses data available");
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch teacher dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const calculateAverageRating = () => {
    if (!feedbackStats?.feedbackByCourse) return 0;

    const courses = Object.values(feedbackStats.feedbackByCourse);
    const totalRating = courses.reduce(
      (sum, course) => sum + course.averageRating,
      0
    );
    return courses.length > 0 ? (totalRating / courses.length).toFixed(1) : 0;
  };

  const getTotalFeedback = () => {
    return feedbackStats?.totalFeedback || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Empty description="Failed to load dashboard data" />
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-500 rounded-3xl mx-6 mt-6 mb-8">
        <div className="px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar
                size={80}
                className="bg-white bg-opacity-20 border-4 border-white border-opacity-30"
                icon={<UserOutlined className="text-white text-2xl" />}
              />
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {getGreeting()}, {stats.userName}!
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  Welcome to your teaching dashboard
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrophyOutlined className="w-5 h-5 text-yellow-300" />
                    <span className="text-yellow-200">
                      Keep inspiring students!
                    </span>
                  </div>
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

      <div className="px-6 pb-8">
        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
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
                        Total Courses
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {stats.totalCourses}
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
                      <TeamOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-green-100 text-sm font-medium">
                        Students Enrolled
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {stats.totalStudents}
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
                      <MessageOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-purple-100 text-sm font-medium">
                        Feedback Received
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {getTotalFeedback()}
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
                      <StarOutlined className="w-6 h-6" />
                    </div>
                    <div>
                      <Text className="text-orange-100 text-sm font-medium">
                        Avg Rating
                      </Text>
                      <Title level={2} className="text-white mb-0 mt-1">
                        {calculateAverageRating()}
                      </Title>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Recent Courses Section */}
          <Col xs={24} lg={16}>
            <Card
              className="h-full shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOutlined className="w-5 h-5 text-blue-600" />
                    </div>
                    <Title level={4} className="mb-0">
                      Recent Courses
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/teacher/managecourses")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                  >
                    Manage Courses
                  </Button>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course, index) => (
                    <div
                      key={course._id}
                      className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            size={48}
                            className="bg-gradient-to-br from-blue-500 to-purple-600"
                          >
                            <BookOutlined className="w-6 h-6 text-white" />
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {course.description || "No description available"}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Tag
                                color={course.isApproved ? "green" : "orange"}
                              >
                                {course.isApproved
                                  ? "✅ Approved"
                                  : "⏳ Pending"}
                              </Tag>
                              <Text className="text-sm text-gray-500">
                                PKR {course.price}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => navigate(`/teacher/managecourses`)}
                          >
                            View
                          </Button>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => navigate("/teacher/managecourses")}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOutlined className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Title level={4} className="text-gray-500">
                    No courses created yet
                  </Title>
                  <Text className="text-gray-400 mb-4">
                    Start your teaching journey by creating your first course
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                    onClick={() => navigate("/teacher/managecourses")}
                  >
                    Create Your First Course
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* Feedback Insights & Chart */}
          <Col xs={24} lg={8}>
            <div className="space-y-6">
              {/* Feedback Insights */}
              <Card
                className="shadow-lg border-0 rounded-2xl"
                title={
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <StarOutlined className="w-5 h-5 text-green-600" />
                    </div>
                    <Title level={4} className="mb-0">
                      Feedback Insights
                    </Title>
                  </div>
                }
                bodyStyle={{ padding: "24px" }}
              >
                {feedbackStats?.feedbackByCourse ? (
                  <div className="space-y-4">
                    {Object.entries(feedbackStats.feedbackByCourse)
                      .slice(0, 3)
                      .map(([courseId, courseData]) => (
                        <div
                          key={courseId}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Text className="font-medium text-gray-800 truncate">
                              {courseData.courseTitle}
                            </Text>
                            <Rate
                              disabled
                              value={courseData.averageRating}
                              style={{ fontSize: "14px" }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <Text>{courseData.totalFeedback} reviews</Text>
                            <Text className="font-semibold">
                              {courseData.averageRating}/5
                            </Text>
                          </div>
                        </div>
                      ))}
                    <Button
                      type="link"
                      className="w-full"
                      onClick={() => navigate("/teacher/feedback")}
                    >
                      View All Feedback →
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageOutlined className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <Text className="text-gray-500">
                      No feedback received yet
                    </Text>
                  </div>
                )}
              </Card>

              {/* Course Progress Chart */}
              <Card
                className="shadow-lg border-0 rounded-2xl"
                title={
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <RiseOutlined className="w-5 h-5 text-purple-600" />
                    </div>
                    <Title level={4} className="mb-0">
                      Course Progress
                    </Title>
                  </div>
                }
                bodyStyle={{ padding: "24px" }}
              >
                {stats.courseProgress && stats.courseProgress.length > 0 ? (
                  <Column {...chartConfig} />
                ) : (
                  <div className="text-center py-8">
                    <RiseOutlined className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <Text className="text-gray-500">
                      No progress data available
                    </Text>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>

        {/* Recent Enrolled Students */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col span={24}>
            <Card
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TeamOutlined className="w-5 h-5 text-indigo-600" />
                  </div>
                  <Title level={4} className="mb-0">
                    Recent Enrolled Students
                  </Title>
                </div>
              }
              bodyStyle={{ padding: "24px" }}
            >
              <Table
                columns={columns}
                dataSource={stats.enrolledStudentsTable.map((e, i) => ({
                  ...e,
                  key: i,
                }))}
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TeacherHome;
