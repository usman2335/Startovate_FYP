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

  if (!course) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <p className="text-body text-[#535353]">Loading course...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-['Poppins',sans-serif]">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-premium">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] border-none px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
        >
          ← Back
        </button>

        <h2 className="text-heading-2 text-center text-[#1f1f1f] mb-6">
          Easypaisa Payment
        </h2>

        {/* Course Info */}
        <div className="bg-[#f9fafb] p-6 rounded-lg mt-4 mb-8 border border-[#e5e7eb] shadow-sm">
          <h3 className="text-heading-4 text-[#1f1f1f] mb-2">
            {course.title}
          </h3>
          <p className="text-body-sm text-[#535353] mb-4">
            {course.description}
          </p>
          <p className="text-body-sm text-[#535353] mb-2">
            <strong className="text-[#1f1f1f]">Instructor:</strong> {course.instructorName}
          </p>
          <p className="text-heading-4 text-[#dc2626]">
            <strong>Price:</strong> PKR {course.price}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-label text-[#1f1f1f] mb-2 block">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              placeholder="e.g. T123456789"
              className="input-premium w-full"
            />
          </div>

          <div className="mb-5 flex flex-col">
            <label className="text-label text-[#1f1f1f] mb-2">
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
              <Button icon={<UploadOutlined />} type="default">
                Click to Upload Screenshot
              </Button>
            </Upload>
          </div>

          <button
            type="submit"
            className="btn-primary-red w-full"
          >
            Submit Payment
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-body text-[#1f1f1f]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EasypaisaCoursePayment;
