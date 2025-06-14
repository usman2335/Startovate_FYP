import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51RZWrsEQHPOtDYyWHhEHCaYRkod0N9zWoPU7U1ouMGTCD6qlZOWWfy771wZkzs1dIF07KtsI9k91fFTMRqsVthIZ00wEQuXQp8"
);

const PaymentPage = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {},
        {
          withCredentials: true,
        }
      );

      setClientSecret(res.data.clientSecret);
      setShowCheckout(true);
    } catch (err) {
      console.error(err);
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
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          padding: "3rem 2rem",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={() => navigate("/homepage")}
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
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Subscribe to Unlock Full Access
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Get unlimited access to all Lean Canvas tools, templates, and exports
          for only <strong>$5</strong>.
        </p>

        {!showCheckout && (
          <>
            <div
              style={{
                marginTop: "2rem",
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
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#635bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  minWidth: "180px",
                }}
              >
                {loading && selectedMethod === "card"
                  ? "Loading..."
                  : "Pay with Card"}
              </button>

              <button
                onClick={() => {
                  setSelectedMethod("easypaisa");
                  navigate("/easypaisa");
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  minWidth: "180px",
                }}
              >
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
    </div>
  );
};

export default PaymentPage;
