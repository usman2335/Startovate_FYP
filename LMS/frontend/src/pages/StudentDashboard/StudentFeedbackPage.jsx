import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Rate,
  Typography,
  Space,
  Button,
  Empty,
  Spin,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  notification,
} from "antd";
import {
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import EditFeedbackModal from "../../components/EditFeedbackModal";
import DeleteFeedbackModal from "../../components/DeleteFeedbackModal";

const { Title, Text, Paragraph } = Typography;

const StudentFeedbackPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchStudentFeedback();
  }, []);

  const fetchStudentFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/feedback/student`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setFeedback(response.data.feedback);
      } else {
        setError(response.data.message || "Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching student feedback:", error);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditFeedback = (feedbackItem) => {
    console.log("Opening edit modal for feedback:", feedbackItem);
    setEditingFeedback(feedbackItem);
    setEditModalVisible(true);
  };

  const handleEditSuccess = (updatedFeedback) => {
    console.log("Feedback updated successfully:", updatedFeedback);

    // Update the feedback in the state without refetching
    setFeedback((prevFeedback) =>
      prevFeedback.map((fb) =>
        fb._id === updatedFeedback._id ? updatedFeedback : fb
      )
    );

    notification.success({
      message: "Feedback Updated Successfully! ✏️",
      description: "Your feedback has been updated and saved.",
      duration: 4,
      placement: "topRight",
    });
  };

  const handleDeleteClick = (feedbackItem) => {
    console.log("Opening delete modal for feedback:", feedbackItem);
    setDeletingFeedback(feedbackItem);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFeedback) return;

    setDeleteLoading(true);
    try {
      console.log("Deleting feedback:", deletingFeedback._id);

      const response = await axios.delete(
        `${BACKEND_BASE_URL}/api/feedback/delete/${deletingFeedback._id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response:", response.data);

      if (response.data.success) {
        // Remove the feedback from the state without refetching
        setFeedback((prevFeedback) =>
          prevFeedback.filter((fb) => fb._id !== deletingFeedback._id)
        );

        notification.success({
          message: "Feedback Deleted Successfully! 🗑️",
          description: `Your feedback for "${deletingFeedback.course?.title || 'the course'}" has been deleted.`,
          duration: 4,
          placement: "topRight",
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
          },
        });

        setDeleteModalVisible(false);
        setDeletingFeedback(null);
      } else {
        notification.error({
          message: "Delete Failed",
          description:
            response.data.message ||
            "Failed to delete feedback. Please try again.",
          duration: 5,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);

      let errorMessage = "Failed to delete feedback. Please try again.";
      let errorTitle = "Delete Error";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (errorMessage.includes("not found")) {
          errorTitle = "Feedback Not Found";
        } else if (errorMessage.includes("permission")) {
          errorTitle = "Access Denied";
        }
      } else if (error.code === "ERR_NETWORK") {
        errorTitle = "Network Error";
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      } else if (error.response?.status === 401) {
        errorTitle = "Authentication Error";
        errorMessage = "Please log in again to delete feedback.";
      } else if (error.response?.status === 403) {
        errorTitle = "Access Denied";
        errorMessage = "You don't have permission to delete this feedback.";
      }

      notification.error({
        message: errorTitle,
        description: errorMessage,
        duration: 6,
        placement: "topRight",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeletingFeedback(null);
  };

  const columns = [
    {
      title: "Course",
      dataIndex: ["course", "title"],
      key: "courseTitle",
      render: (text, record) => (
        <div>
          <Text strong>{text || "Unknown Course"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Instructor: {record.course?.instructorName || "Unknown"}
          </Text>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <div className="flex items-center space-x-2">
          <Rate disabled value={rating} style={{ fontSize: "14px" }} />
          <Text strong>({rating}/5)</Text>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (comment) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
          style={{ marginBottom: 0, maxWidth: 300 }}
        >
          {comment}
        </Paragraph>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div>
          <CalendarOutlined className="mr-1" />
          <Text type="secondary">{formatDate(date)}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditFeedback(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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
          My Feedback
        </Title>
        <Text type="secondary">
          View and manage all feedback you have submitted for courses
        </Text>
      </div>

      {/* Summary Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Feedback"
              value={feedback.length}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Rating Given"
              value={
                feedback.length > 0
                  ? (
                      feedback.reduce((sum, f) => sum + f.rating, 0) /
                      feedback.length
                    ).toFixed(1)
                  : 0
              }
              suffix={<StarOutlined />}
              precision={1}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Courses Reviewed"
              value={new Set(feedback.filter((f) => f.course?._id).map((f) => f.course._id)).size}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Feedback Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={feedback}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} feedback`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No feedback submitted yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" href="/student/mycourses">
                  Submit Your First Feedback
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* Edit Feedback Modal */}
      <EditFeedbackModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        feedbackData={editingFeedback}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteFeedbackModal
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        feedbackData={deletingFeedback}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default StudentFeedbackPage;
