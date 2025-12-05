import React, { useState } from "react";
import { Modal, Form, Input, Rate, Button, notification } from "antd";
import axios from "axios";
import FeedbackConfirmationModal from "./FeedbackConfirmationModal";

const { TextArea } = Input;

const FeedbackModal = ({
  visible,
  onCancel,
  courseId,
  courseTitle,
  instructorName,
  onSuccess,
}) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/feedback/submit`,
        {
          courseId,
          rating: values.rating,
          comment: values.comment,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Store the submitted feedback data
        setSubmittedFeedback(response.data.feedback);

        // Close the feedback modal
        form.resetFields();
        onCancel();

        // Show confirmation modal
        setConfirmationVisible(true);

        // Call success callback
        onSuccess(response.data.feedback);
      } else {
        notification.error({
          message: "Feedback Submission Failed",
          description:
            response.data.message ||
            "Failed to submit feedback. Please try again.",
          duration: 5,
          placement: "topRight",
          style: {
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);

      // Handle different types of errors with specific messages
      let errorMessage = "Failed to submit feedback. Please try again.";
      let errorTitle = "Submission Error";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Customize title based on error type
        if (errorMessage.includes("already submitted")) {
          errorTitle = "Duplicate Feedback";
          errorMessage = `You have already submitted feedback for "${courseTitle}". Each student can only submit one feedback per course.`;
        } else if (errorMessage.includes("enrolled")) {
          errorTitle = "Enrollment Required";
          errorMessage = `You must be enrolled in "${courseTitle}" to submit feedback.`;
        } else if (errorMessage.includes("students can submit")) {
          errorTitle = "Access Denied";
          errorMessage = "Only students can submit feedback for courses.";
        }
      } else if (error.code === "ERR_NETWORK") {
        errorTitle = "Network Error";
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      } else if (error.response?.status === 401) {
        errorTitle = "Authentication Error";
        errorMessage = "Please log in again to submit feedback.";
      } else if (error.response?.status === 403) {
        errorTitle = "Access Denied";
        errorMessage =
          "You don't have permission to submit feedback for this course.";
      }

      // Special handling for duplicate feedback
      if (errorTitle === "Duplicate Feedback") {
        notification.warning({
          message: errorTitle,
          description: errorMessage,
          duration: 8,
          placement: "topRight",
          style: {
            backgroundColor: "#fffbe6",
            border: "1px solid #ffe58f",
          },
          btn: (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                notification.destroy();
                // You could add a function to view existing feedback here
                console.log("View existing feedback for course:", courseId);
              }}
            >
              View My Feedback
            </Button>
          ),
        });
      } else {
        notification.error({
          message: errorTitle,
          description: errorMessage,
          duration: 6,
          placement: "topRight",
          style: {
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Submit Feedback - ${courseTitle}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Course:</strong> {courseTitle}
        </p>
        <p className="text-gray-600">
          <strong>Instructor:</strong> {instructorName}
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ rating: 5 }}
      >
        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: "Please provide a rating" }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Comments"
          rules={[
            { required: true, message: "Please provide your feedback" },
            { min: 10, message: "Please provide at least 10 characters" },
            { max: 1000, message: "Comments cannot exceed 1000 characters" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Share your thoughts about the course, instructor, content quality, etc."
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Feedback
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Confirmation Modal */}
      <FeedbackConfirmationModal
        visible={confirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        feedbackData={submittedFeedback}
        courseTitle={courseTitle}
      />
    </Modal>
  );
};

export default FeedbackModal;
