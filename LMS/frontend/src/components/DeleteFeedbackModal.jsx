import React from "react";
import { Modal, Button, Typography, Space } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const DeleteFeedbackModal = ({
  visible,
  onCancel,
  feedbackData,
  onConfirm,
  loading,
}) => {
  if (!feedbackData) return null;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <ExclamationCircleOutlined className="text-red-500 text-xl" />
          <span className="text-red-600 font-semibold">Delete Feedback</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <ExclamationCircleOutlined className="text-red-500 text-6xl" />
        </div>

        {/* Course Information */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Title level={4} className="mb-2">
            {feedbackData.course.title}
          </Title>
          <Text type="secondary">
            Instructor: {feedbackData.course.instructorName}
          </Text>
        </div>

        {/* Feedback Summary */}
        <div className="bg-red-50 p-4 rounded-lg">
          <Title level={5} className="mb-2 text-red-700">
            Feedback to be Deleted
          </Title>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Text strong>Rating:</Text>
              <Text className="text-lg">⭐ {feedbackData.rating}/5</Text>
            </div>
            <div className="text-left">
              <Text strong>Comment:</Text>
              <Paragraph
                className="mt-1 bg-white p-2 rounded border"
                style={{ marginBottom: 0 }}
                ellipsis={{ rows: 3, expandable: true }}
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

        {/* Warning Message */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-yellow-600 text-lg mt-0.5" />
            <div>
              <Text strong className="text-yellow-800">
                This action cannot be undone!
              </Text>
              <br />
              <Text className="text-yellow-700">
                Once deleted, this feedback will be permanently removed and
                cannot be recovered.
              </Text>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Space size="middle" className="w-full justify-center">
          <Button onClick={onCancel} size="large" disabled={loading}>
            Cancel
          </Button>
          <Button
            danger
            onClick={onConfirm}
            loading={loading}
            size="large"
            icon={<DeleteOutlined />}
          >
            Delete Feedback
          </Button>
        </Space>

        {/* Additional Information */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded text-center">
          💡 <strong>Note:</strong> You can always submit new feedback for this
          course after deletion.
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFeedbackModal;
