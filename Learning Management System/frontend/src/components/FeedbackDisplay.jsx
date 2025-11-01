import React, { useState, useEffect } from "react";
import {
  Card,
  Rate,
  Typography,
  Space,
  Tag,
  Empty,
  Spin,
  Button,
  Modal,
  List,
  Divider,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

const FeedbackDisplay = ({ courseId, courseTitle }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);

  useEffect(() => {
    console.log("=== FeedbackDisplay useEffect ===");
    console.log("CourseId:", courseId);
    console.log("CourseTitle:", courseTitle);

    if (courseId) {
      fetchFeedback();
    } else {
      console.log("No courseId provided, skipping fetch");
      setError("No course ID provided");
      setLoading(false);
    }
  }, [courseId]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      console.log("=== FeedbackDisplay Debug ===");
      console.log("Fetching feedback for courseId:", courseId);
      console.log(
        "Request URL:",
        `http://localhost:5000/api/feedback/course/${courseId}`
      );

      const response = await axios.get(
        `http://localhost:5000/api/feedback/course/${courseId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Response received:", response.data);
      console.log("Response status:", response.status);

      if (response.data.success) {
        setFeedback(response.data.feedback);
        setAverageRating(response.data.averageRating);
        setTotalFeedback(response.data.totalFeedback);
        console.log("Feedback data set successfully");
      } else {
        console.log("Response indicates failure:", response.data.message);
        setError(response.data.message || "Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      // More specific error handling
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to view this feedback.");
      } else if (error.response?.status === 404) {
        setError("Course not found or no feedback available.");
      } else if (error.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch feedback. Please try again."
        );
      }
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
        <Empty
          description={
            <div>
              <Text type="danger">{error}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Course ID: {courseId || "Not provided"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Course Title: {courseTitle || "Not provided"}
              </Text>
            </div>
          }
        />
      </Card>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <Empty
          description="No feedback received yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Average Rating"
              value={averageRating}
              precision={1}
              suffix={<StarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Feedback"
              value={totalFeedback}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Course"
              value={courseTitle}
              valueStyle={{ fontSize: "16px" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Feedback List */}
      <Card title="Student Feedback">
        <List
          dataSource={feedback}
          renderItem={(item) => (
            <List.Item>
              <Card size="small" className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <UserOutlined />
                    <Text strong>{item.student.name}</Text>
                    <Tag color="blue">{item.student.email}</Tag>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarOutlined />
                    <Text type="secondary">{formatDate(item.createdAt)}</Text>
                  </div>
                </div>

                <div className="mb-2">
                  <Rate
                    disabled
                    value={item.rating}
                    style={{ fontSize: "16px" }}
                  />
                  <Text className="ml-2">({item.rating}/5)</Text>
                </div>

                <Paragraph className="mb-0">{item.comment}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default FeedbackDisplay;
