import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { RiFileUploadLine } from "react-icons/ri";

const buttonStyle = {
  cursor: "pointer",
  background: "linear-gradient(90deg, #ed2567 0%, #ee343b 100%)",
  borderRadius: "50px",
  border: "none",
  color: "#f1f1f1",
  fontSize: "1rem",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  transition: "all 0.3s ease",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontFamily: "Poppins, sans-serif",
};

const Easypaisa = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proofImage) {
      setErrorMessage("Please upload a screenshot before submitting.");
      return;
    }
    setErrorMessage("");
    setTimeout(() => {
      navigate("/thankyou");
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
    }
  };

  const imagePreviewUrl = proofImage ? URL.createObjectURL(proofImage) : null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        boxShadow: hovered
          ? "inset 0 0 60px rgba(0,0,0,0.05)"
          : "inset 0 0 0 transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

      <button
        onClick={() => navigate("/payment")}
        onMouseEnter={() => setBtnHover("back")}
        onMouseLeave={() => setBtnHover(null)}
        style={{
          ...buttonStyle,
          position: "absolute",
          top: "1rem",
          left: "1rem",
          fontSize: "0.9rem",
          zIndex: 1,
          transform: btnHover === "back" ? "scale(1.05)" : "scale(1)",
          filter: btnHover === "back" ? "brightness(1.1)" : "none",
        }}
      >
        <FaArrowLeft /> Go Back
      </button>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "3rem 2rem",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: cardHovered
            ? "0 12px 40px rgba(0, 0, 0, 0.2)"
            : "0 6px 30px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          animation: "fadeInUp 0.5s ease-out",
          transition: "all 0.3s ease",
          transform: cardHovered ? "scale(1.015)" : "scale(1)",
        }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Easypaisa Payment
        </h2>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "2rem",
            backgroundColor: "#fafafa",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Bill Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Lean Canvas Subscription (1 month)</span>
            <strong>PKR 1,400</strong>
          </div>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "1rem" }}
          required
        />

        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "1rem",
              cursor: "pointer",
              border: "1px solid #ccc",
            }}
            onClick={() => setShowModal(true)}
          />
        )}

        {errorMessage && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
        )}

        <button
          type="submit"
          style={{
            ...buttonStyle,
            width: "100%",
            transform: btnHover === "submit" ? "scale(1.05)" : "scale(1)",
            filter: btnHover === "submit" ? "brightness(1.1)" : "none",
          }}
          onMouseEnter={() => setBtnHover("submit")}
          onMouseLeave={() => setBtnHover(null)}
        >
          <RiFileUploadLine /> Submit Payment Details
        </button>
      </form>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={imagePreviewUrl}
            alt="Full View"
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Easypaisa;
