import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EasypaisaPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofImage) return setMessage("Please upload payment proof");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("transactionId", transactionId);
    formData.append("screenshot", proofImage);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/easypaisa-submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setMessage("Submitted successfully! Please wait for admin approval.");
    } catch (error) {
      setMessage("Submission failed. Try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "2rem",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Go Back Button */}
        <button
          onClick={() => navigate("/payment")}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Go Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
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

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ marginBottom: "1rem" }}>
            <label>Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.3rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.3rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Transaction ID</label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.3rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Upload Screenshot/Proof of Payment</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setProofImage(e.target.files[0])}
              style={{ marginTop: "0.5rem" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Submit Payment Details
          </button>

          {message && (
            <p
              style={{ marginTop: "1rem", textAlign: "center", color: "#555" }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EasypaisaPage;
