// pages/payment/StripePaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

const StripePaymentPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createSession = async () => {
      if (!course) {
        setError("No course selected.");
        return;
      }

      // ✅ Store course ID in localStorage for later enrollment
      localStorage.setItem("paid_course_id", course.id);

      try {
        const res = await axios.post(
          `${BACKEND_BASE_URL}/api/payment/create-checkout-session`,
          {
            courseId: course.id,
            amount: course.price * 100,
            title: course.title,
          },
          { withCredentials: true }
        );

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError("Failed to initiate Stripe checkout.");
        console.error(err);
      }
    };

    createSession();
  }, [course]);

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center mt-20">
        <p>Loading Stripe Checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Stripe Payment for "{course?.title}"
        </h2>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default StripePaymentPage;
