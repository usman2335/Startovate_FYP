import React, { useEffect, useState } from "react";
import { Table, Button, Image, message } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentApproval = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [payments, setPayments] = useState([]);

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/api/payment/easypaisa-pending`,
        { withCredentials: true }
      );
      setPayments(res.data.payments);
    } catch (error) {
      message.error("Failed to load pending payments");
    }
  };

  const handleApprove = async (paymentId) => {
    const result = await Swal.fire({
      title: "Approve Payment?",
      text: "This will enroll the student in the course.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `${BACKEND_BASE_URL}/api/payment/easypaisa-approve/${paymentId}`,
          null,
          { withCredentials: true }
        );
        Swal.fire(
          "Approved!",
          "Payment verified and student enrolled",
          "success"
        );
        fetchPendingPayments();
      } catch (error) {
        message.error("Approval failed");
      }
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const columns = [
    {
      title: "Student",
      dataIndex: ["userId", "name"],
      key: "student",
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
      key: "email",
    },
    {
      title: "Course",
      dataIndex: ["courseId", "title"],
      key: "course",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Screenshot",
      dataIndex: "screenshotUrl",
      key: "screenshot",
      render: (url) => (
        <Image
          width={100}
          src={`${BACKEND_BASE_URL}${url}`}
          alt="Payment Screenshot"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleApprove(record._id)}>
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Pending Easypaisa Payments</h2>
      <Table columns={columns} dataSource={payments} rowKey="_id" bordered />
    </div>
  );
};

export default PaymentApproval;
