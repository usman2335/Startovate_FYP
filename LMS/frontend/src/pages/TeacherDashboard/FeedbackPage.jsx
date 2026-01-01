import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Rate,
  Typography,
  Space,
  Button,
  Modal,
  Empty,
  Spin,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd";
import {
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import FeedbackDisplay from "../../components/FeedbackDisplay";

const { Title, Text, Paragraph } = Typography;

const TeacherFeedbackPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [feedbackByCourse, setFeedbackByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalFeedback, setTotalFeedback] = useState(0);

  useEffect(() => {
    fetchTeacherFeedback();
  }, []);

  const fetchTeacherFeedback = async () => {
    try {
      setLoading(true);
      console.log("=== fetchTeacherFeedback Debug ===");
      console.log("Fetching teacher feedback...");

      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/feedback/teacher/all`,
        {
          withCredentials: true,
        }
      );

      console.log("Teacher feedback response:", response.data);
      console.log("Response status:", response.status);

      if (response.data.success) {
        console.log("Feedback by course:", response.data.feedbackByCourse);
        console.log("Total feedback:", response.data.totalFeedback);
        setFeedbackByCourse(response.data.feedbackByCourse);
        setTotalFeedback(response.data.totalFeedback);
      } else {
        console.log("Response indicates failure:", response.data.message);
        setError(response.data.message || "Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching teacher feedback:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError("Failed to fetch feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const viewCourseFeedback = (courseId, courseTitle) => {
    console.log("=== viewCourseFeedback Debug ===");
    console.log("CourseId:", courseId);
    console.log("CourseTitle:", courseTitle);
    console.log("Setting selected course:", { courseId, courseTitle });
    setSelectedCourse({ courseId, courseTitle });
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Course",
      dataIndex: "courseTitle",
      key: "courseTitle",
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.totalFeedback} feedback
            {record.totalFeedback !== 1 ? "s" : ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Average Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (rating) => (
        <div className="flex items-center space-x-2">
          <Rate disabled value={rating} style={{ fontSize: "14px" }} />
          <Text strong>{rating}/5</Text>
        </div>
      ),
      sorter: (a, b) => a.averageRating - b.averageRating,
    },
    {
      title: "Total Feedback",
      dataIndex: "totalFeedback",
      key: "totalFeedback",
      render: (count) => (
        <Tag color={count > 0 ? "green" : "default"}>
          {count} feedback{count !== 1 ? "s" : ""}
        </Tag>
      ),
      sorter: (a, b) => a.totalFeedback - b.totalFeedback,
    },
    {
      title: "Latest Feedback",
      key: "latestFeedback",
      render: (_, record) => {
        if (record.feedback.length === 0)
          return <Text type="secondary">No feedback</Text>;
        const latest = record.feedback[0];
        return (
          <div>
            <Text>{latest.student.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {formatDate(latest.createdAt)}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() =>
              viewCourseFeedback(record.courseId, record.courseTitle)
            }
            disabled={record.totalFeedback === 0}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = Object.keys(feedbackByCourse).map((courseId) => ({
    key: courseId,
    courseId,
    courseTitle: feedbackByCourse[courseId].courseTitle,
    averageRating: feedbackByCourse[courseId].averageRating,
    totalFeedback: feedbackByCourse[courseId].totalFeedback,
    feedback: feedbackByCourse[courseId].feedback,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Empty description={error} />
      </Card>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>
          <MessageOutlined className="mr-2" />
          Course Feedback
        </Title>
        <Text type="secondary">
          View and analyze feedback from students for your courses
        </Text>
      </div>

      {/* Summary Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Courses"
              value={dataSource.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Feedback"
              value={totalFeedback}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Courses with Feedback"
              value={
                dataSource.filter((course) => course.totalFeedback > 0).length
              }
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Feedback Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No courses found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Course Feedback Modal */}
      <Modal
        title={`Feedback Details - ${selectedCourse?.courseTitle}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedCourse && (
          <FeedbackDisplay
            courseId={selectedCourse.courseId}
            courseTitle={selectedCourse.courseTitle}
          />
        )}
      </Modal>
    </div>
  );
};

export default TeacherFeedbackPage;
