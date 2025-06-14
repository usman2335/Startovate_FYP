import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ReturnPage = () => {
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
        `http://localhost:5000/api/payment/session-status?session_id=${sessionId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setStatus(res.data.status);
        setCustomerEmail(res.data.customer_email);

        if (res.data.status === "complete") {
          // ⏳ Wait 3 seconds, then redirect
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

  if (status === "complete") {
    axios.patch(
      "http://localhost:5000/api/users/mark-subscribed",
      {},
      {
        withCredentials: true,
      }
    );

    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>✅ Payment Successful</h2>
        <p>
          Thank you for subscribing! A confirmation email has been sent to{" "}
          <strong>{customerEmail}</strong>.
        </p>
        <p>Redirecting to homepage...</p>
      </div>
    );
  }

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>🔄 Verifying your payment...</h2>
    </div>
  );
};

export default ReturnPage;
