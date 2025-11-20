import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ReturnPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (!sessionId) return;

    axios
      .get(
        `${BACKEND_BASE_URL}/api/payment/session-status?session_id=${sessionId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setStatus(res.data.status);
        setCustomerEmail(res.data.customer_email);

        if (res.data.status === "complete") {
          setTimeout(() => {
            setRedirect(true);
          }, 5000);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch session status", err);
      });
  }, []);

  if (redirect) {
    return <Navigate to="/" />;
  }

  const sharedContainerStyle = {
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
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: "3rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    width: "100%",
    zIndex: 1,
  };

  const vectors = (
    <>
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
    </>
  );

  if (status === "complete") {
    axios.patch(
      `${BACKEND_BASE_URL}/api/users/mark-subscribed`,
      {},
      {
        withCredentials: true,
      }
    );

    return (
      <div style={sharedContainerStyle}>
        {vectors}
        <div style={boxStyle}>
          <h2 style={{ fontSize: "2rem", color: "#333" }}>
            ✅ Payment Successful
          </h2>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Thank you for subscribing! A confirmation email has been sent to{" "}
            <strong>{customerEmail}</strong>.
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#999" }}>
            Redirecting to homepage...
          </p>
        </div>
      </div>
    );
  }

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  return (
    <div style={sharedContainerStyle}>
      {vectors}
      <div style={boxStyle}>
        <h2 style={{ fontSize: "2rem", color: "#333" }}>
          🔄 Verifying your payment...
        </h2>
      </div>
    </div>
  );
};

export default ReturnPage;
