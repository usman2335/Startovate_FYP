import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleMouseEnter = (e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.filter = "brightness(1.1)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.filter = "none";
  };

  const handleBoxEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0 8px 36px rgba(0, 0, 0, 0.15)";
  };

  const handleBoxLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 6px 30px rgba(0, 0, 0, 0.1)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          zIndex: 0,
          opacity: 0.1,
        }}
        width="300"
        height="300"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="100" fill="#ed2567" />
      </svg>
      <svg
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          zIndex: 0,
          opacity: 0.1,
        }}
        width="300"
        height="300"
        viewBox="0 0 200 200"
      >
        <rect width="200" height="200" rx="40" fill="#ed2567" />
      </svg>

      <div
        onMouseEnter={handleBoxEnter}
        onMouseLeave={handleBoxLeave}
        style={{
          backgroundColor: "#fff",
          padding: "3rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          zIndex: 1,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <FaCheckCircle
          size={64}
          color="#ed2567"
          style={{ marginBottom: "1rem" }}
        />
        <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "0.5rem" }}>
          Thank You!
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "2rem" }}>
          Your Easypaisa payment details have been submitted successfully.
          Please wait for admin approval.
        </p>
        <button
          onClick={() => navigate("/")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            background: "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "50px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "transform 0.3s ease, filter 0.3s ease",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
