import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMobileAlt, FaArrowLeft } from "react-icons/fa";

const stripePromise = loadStripe(
  "pk_test_51RZWrsEQHPOtDYyWHhEHCaYRkod0N9zWoPU7U1ouMGTCD6qlZOWWfy771wZkzs1dIF07KtsI9k91fFTMRqsVthIZ00wEQuXQp8"
);

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

const PaymentPage = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {},
        { withCredentials: true }
      );
      setClientSecret(res.data.clientSecret);
      setShowCheckout(true);
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to create checkout session";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Background Shapes */}
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

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/homepage")}
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

      {/* Main Card */}
      <div
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        style={{
          maxWidth: "700px",
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
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Subscribe to Unlock Full Access
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Get unlimited access to all Lean Canvas tools, templates, and exports
          for only <strong>$5</strong>.
        </p>

        {/* Benefits List */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "1.5rem 0",
            textAlign: "left",
            color: "#333",
            fontSize: "1rem",
          }}
        >
          <li>✔ Unlimited Lean Canvas creation</li>
          <li>✔ Export to PDF/Word</li>
          <li>✔ Access to AI Assistant</li>
          <li>✔ One-time $5 payment</li>
        </ul>

        {!showCheckout && (
          <>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setSelectedMethod("card");
                  handleSubscribe();
                }}
                disabled={loading}
                onMouseEnter={() => setBtnHover("card")}
                onMouseLeave={() => setBtnHover(null)}
                style={{
                  ...buttonStyle,
                  transform: btnHover === "card" ? "scale(1.05)" : "scale(1)",
                  filter: btnHover === "card" ? "brightness(1.1)" : "none",
                }}
              >
                <FaCreditCard />
                {loading && selectedMethod === "card"
                  ? "Loading..."
                  : "Pay with Card"}
              </button>

              <button
                onClick={() => {
                  setSelectedMethod("easypaisa");
                  navigate("/easypaisa");
                }}
                onMouseEnter={() => setBtnHover("easypaisa")}
                onMouseLeave={() => setBtnHover(null)}
                style={{
                  ...buttonStyle,
                  transform:
                    btnHover === "easypaisa" ? "scale(1.05)" : "scale(1)",
                  filter: btnHover === "easypaisa" ? "brightness(1.1)" : "none",
                }}
              >
                <FaMobileAlt />
                Pay with Easypaisa
              </button>
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "1rem",
                  fontSize: "0.95rem",
                }}
              >
                {error}
              </p>
            )}
          </>
        )}

        {clientSecret && selectedMethod === "card" && (
          <div style={{ marginTop: "3rem" }}>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
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

export default PaymentPage;
