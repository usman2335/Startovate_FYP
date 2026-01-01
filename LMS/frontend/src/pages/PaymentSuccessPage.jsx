import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const PaymentSuccessPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasEnrolled = useRef(false); // ✅ new ref guard
  const navigate = useNavigate();

  useEffect(() => {
    const enrollCourse = async () => {
      if (hasEnrolled.current) return; // ✅ prevent re-run
      hasEnrolled.current = true;

      const courseId = localStorage.getItem("paid_course_id");

      if (!courseId) {
        setStatus("error");
        setMessage("No course information found.");
        return;
      }

      try {
        const res = await axios.post(
          `${BACKEND_BASE_URL}/api/enroll`,
          { courseId },
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("You have been successfully enrolled in the course!");
          localStorage.removeItem("paid_course_id");
        } else {
          throw new Error(res.data.message || "Enrollment failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Failed to enroll in course.");
        console.error(error);
      }
    };

    enrollCourse();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {status === "loading" && (
        <p className="text-xl font-semibold">Processing your enrollment...</p>
      )}

      {status === "success" && (
        <div className="text-center">
          <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="mb-6">{message}</p>
          <button
            onClick={() => navigate("/student/mycourses")}
            className="bg-[#183e6a] text-white px-6 py-2 rounded-full hover:bg-[#122e50]"
          >
            Go to My Courses
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <CloseCircleOutlined className="text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Enrollment Failed</h2>
          <p className="mb-6">{message}</p>
          <button
            onClick={() => navigate("/student/enroll")}
            className="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
