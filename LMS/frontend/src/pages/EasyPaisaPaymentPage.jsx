import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

const EasypaisaCoursePayment = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [course, setCourse] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/courses/${courseId}`
        );
        setCourse(res.data.course);
        console.log(course);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !proofImage)
      return setMessage("Please enter all required fields.");

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("transactionId", transactionId);
    formData.append("screenshot", proofImage);

    try {
      await axios.post(
        `${BACKEND_BASE_URL}/api/payment/easypaisa-submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Show success alert and then navigate
      Swal.fire({
        title: "Success!",
        text: "Payment submitted. Please wait for admin approval.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/student"); // navigate to home after alert
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Submission failed. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  if (!course) return <p style={{ textAlign: "center" }}>Loading course...</p>;

  return (
    <div
      style={{
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#e0e7ff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#1f2937",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Easypaisa Payment
        </h2>

        {/* Course Info */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "10px",
            marginTop: "1rem",
            marginBottom: "2rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              margin: "0 0 0.5rem",
              color: "#111827",
              fontSize: "1.3rem",
            }}
          >
            {course.title}
          </h3>
          <p style={{ margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>
            {course.description}
          </p>
          <p
            style={{ marginTop: "1rem", color: "#374151", fontSize: "0.95rem" }}
          >
            <strong>Instructor:</strong> {course.instructorName}
          </p>
          <p
            style={{
              color: "#111827",
              fontSize: "1.05rem",
              fontWeight: "bold",
            }}
          >
            <strong>Price:</strong> PKR {course.price}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ fontWeight: "bold" }}>Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              placeholder="e.g. T123456789"
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                marginTop: "0.3rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.2rem" }} className="flex flex-col">
            <label style={{ fontWeight: "bold" }}>
              Upload Screenshot of Payment
            </label>
            <Upload
              beforeUpload={(file) => {
                setProofImage(file);
                return false; // Prevent automatic upload
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                Click to Upload Screenshot
              </Button>
            </Upload>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#10b981",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Submit Payment
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "#1f2937",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EasypaisaCoursePayment;
