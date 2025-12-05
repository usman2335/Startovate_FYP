import React, { useContext, useState } from "react";
import SignupCard from "../components/SignupCard"; // Import the Card component
import Button from "../components/Button"; // Import your reusable Button component
import "../CSS/Signup.css";
import { TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/authContext";

const LoginPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { checkAuthStatus } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Email and password are required",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/users/login`,
        formData,
        { withCredentials: true }
      );

      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user)); // Save logged-in user

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (user.role === "superadmin") navigate("/admin");
        else if (user.role === "teacher") navigate("/teacher");
        else if (user.role === "student") navigate("/student");
        else navigate("/"); // fallback
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="signup-container">
      {/* Background Vector */}
      <div className="vector-background"></div>

      <SignupCard />

      <div className="signup-form">
        <h1>Logo</h1>
        <h2>Create your account now</h2>

        <form className="form1" onSubmit={handleSubmit}>
          <div className="signup-input-container">
            <label className="signup-input-label">Email</label>
            <TextField
              id="login-email-field"
              label="Enter your email"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              name="email"
              value={formData.email}
            />
          </div>

          <div className="signup-input-container">
            <label className="signup-input-label">Password</label>
            <TextField
              id="login-password-field"
              type={showPassword ? "text" : "password"}
              label="Enter your password"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              name="password"
              value={formData.password}
            />
          </div>
          <Button
            label="Login"
            onClick={() => console.log("Login clicked!")}
            padding="12px"
            color="white"
            fontSize="18px"
            width="100%"
            marginTop="10px"
          />
        </form>

        <p style={{ marginTop: "3%" }}>
          Create an New Account? <a href="/Signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
