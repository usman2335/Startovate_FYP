import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";

const PaymentModal = ({ open, onClose, course }) => {
  if (!course) return null;
  const navigate = useNavigate();

  const handleStripe = () => {
    navigate("/stripe-payment", { state: { course } });
  };

  const handleEasypaisa = () => {
    navigate("/easypaisa", { state: { courseId: course._id } });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Confirm Enrollment"
      centered
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h3>{course.title}</h3>
        <p>
          <strong>Instructor:</strong> {course.instructor}
        </p>
        <p>
          <strong>Price:</strong> PKR 1400
        </p>
      </div>

      <Button
        type="primary"
        style={{ width: "100%", marginBottom: "1rem" }}
        onClick={handleStripe}
      >
        Pay with Card (Stripe)
      </Button>

      <Button
        type="default"
        style={{ width: "100%" }}
        onClick={handleEasypaisa}
      >
        Pay with Easypaisa
      </Button>
    </Modal>
  );
};

export default PaymentModal;
