import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Rate, Button, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const EditFeedbackModal = ({ visible, onCancel, feedbackData, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && feedbackData) {
      // Pre-fill the form with existing feedback data
      form.setFieldsValue({
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      });
    }
  }, [visible, feedbackData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("=== Edit Feedback Debug ===");
      console.log("Feedback ID:", feedbackData._id);
      console.log("Updated values:", values);

      const response = await axios.put(
        `http://localhost:5000/api/feedback/update/${feedbackData._id}`,
        {
          rating: values.rating,
          comment: values.comment,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Edit response:", response.data);

      if (response.data.success) {
        notification.success({
          message: "Feedback Updated Successfully! ✏️",
          description: `Your feedback for "${feedbackData.course.title}" has been updated.`,
          duration: 4,
          placement: "topRight",
          style: {
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
          },
        });

        form.resetFields();
        onSuccess(response.data.feedback);
        onCancel();
      } else {
        notification.error({
          message: "Update Failed",
          description:
            response.data.message ||
            "Failed to update feedback. Please try again.",
          duration: 5,
          placement: "topRight",
          style: {
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
          },
        });
      }
    } catch (error) {
      console.error("Error updating feedback:", error);

      let errorMessage = "Failed to update feedback. Please try again.";
      let errorTitle = "Update Error";

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
        errorMessage = "Please log in again to update feedback.";
      } else if (error.response?.status === 403) {
        errorTitle = "Access Denied";
        errorMessage = "You don't have permission to update this feedback.";
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <EditOutlined className="text-blue-500 text-xl" />
          <span className="text-blue-600 font-semibold">Edit Feedback</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      {feedbackData && (
        <div className="space-y-4">
          {/* Course Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1">
              {feedbackData.course.title}
            </h4>
            <p className="text-sm text-gray-600">
              Instructor: {feedbackData.course.instructorName}
            </p>
            <p className="text-xs text-gray-500">
              Originally submitted:{" "}
              {new Date(feedbackData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Edit Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please provide a rating" },
                {
                  type: "number",
                  min: 1,
                  max: 5,
                  message: "Rating must be between 1 and 5",
                },
              ]}
            >
              <Rate style={{ fontSize: "24px" }} />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
              rules={[
                { required: true, message: "Please provide a comment" },
                { min: 10, message: "Comment must be at least 10 characters" },
                { max: 1000, message: "Comment cannot exceed 1000 characters" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Share your thoughts about this course..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={<EditOutlined />}
                >
                  Update Feedback
                </Button>
              </div>
            </Form.Item>
          </Form>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            💡 <strong>Tip:</strong> Your updated feedback will help instructors
            improve their courses. Be constructive and specific in your
            comments.
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditFeedbackModal;
