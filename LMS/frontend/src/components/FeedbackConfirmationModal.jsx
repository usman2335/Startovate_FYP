import React from "react";
import { Modal, Button, Typography, Space, Rate } from "antd";
import { CheckCircleOutlined, StarOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const FeedbackConfirmationModal = ({
  visible,
  onClose,
  feedbackData,
  courseTitle,
}) => {
  if (!feedbackData) return null;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CheckCircleOutlined className="text-green-500 text-xl" />
          <span className="text-green-600 font-semibold">
            Feedback Submitted Successfully!
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      className="feedback-confirmation-modal"
    >
      <div className="text-center space-y-4">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircleOutlined className="text-green-500 text-6xl" />
        </div>

        {/* Course Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Title level={4} className="mb-2">
            {courseTitle}
          </Title>
          <Text type="secondary">
            Your feedback has been recorded and will help improve this course.
          </Text>
        </div>

        {/* Feedback Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <Title level={5} className="mb-2">
            Your Feedback Summary
          </Title>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Text strong>Rating:</Text>
              <Rate
                disabled
                value={feedbackData.rating}
                style={{ fontSize: "18px" }}
              />
              <Text>({feedbackData.rating}/5)</Text>
            </div>
            <div className="text-left">
              <Text strong>Comment:</Text>
              <Paragraph
                className="mt-1 bg-white p-2 rounded border"
                style={{ marginBottom: 0 }}
              >
                "{feedbackData.comment}"
              </Paragraph>
            </div>
            <div className="text-sm text-gray-500">
              Submitted on:{" "}
              {new Date(feedbackData.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Space size="middle" className="w-full justify-center">
          <Button type="primary" onClick={onClose} size="large">
            Close
          </Button>
          <Button onClick={onClose} size="large">
            Submit More Feedback
          </Button>
        </Space>

        {/* Additional Information */}
        <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
          💡 <strong>Note:</strong> You can view all your submitted feedback in
          the "My Feedback" section.
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackConfirmationModal;
