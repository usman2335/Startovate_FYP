import React, { useState } from "react";
import SignupCard from "../components/SignupCard";
import Button from "../components/Button";
import "../CSS/Signup.css";
import { TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: validateField(e.target.name, e.target.value),
    }));
    console.log(formData);
  };
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full Name is required";

      case "email":
        if (!value.trim()) return "Email is required";
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email format";

      case "password":
        if (!value) return "Password is required";
        return value.length >= 6
          ? ""
          : "Password must be at least 6 characters";

      case "rePassword":
        return value === formData.password ? "" : "Passwords do not match";

      default:
        return "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      rePassword: validateField("rePassword", formData.rePassword),
    };
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      console.log("User signed up:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Signup successful!",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.error(" Signup Error:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.response?.data?.error || "Something went wrong!",
        });
      } else {
        //  If no response from the server
        console.error(" No Response from Server:", error.message);
        alert("Something went wrong. Please try again.");
      }
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
            <label className="signup-input-label">Full Name</label>
            {/* <input type="text" placeholder="Enter your full name" /> */}
            <TextField
              error={!!errors.fullName}
              helperText={errors.fullName}
              id="signup-name-field"
              label="Enter your full name"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="fullName"
              value={formData.fullName}
            />
          </div>
          <div className="signup-input-container">
            <label className="signup-input-label">Email Address</label>
            <TextField
              error={!!errors.email}
              helperText={errors.email}
              id="signup-email-field"
              label="Enter your email"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="email"
              value={formData.email}
            />
          </div>

          <div className="signup-input-container">
            <label className="signup-input-label">Password</label>
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              id="signup-password-field"
              label="Enter your password"
              type="password"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="password"
              value={formData.password}
            />
          </div>
          <div className="signup-input-container">
            <label className="signup-input-label">Re-Enter Password</label>

            <TextField
              error={!!errors.rePassword}
              helperText={errors.rePassword}
              id="signup-rePassword-field"
              label="Re-enter your password"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              type="password"
              name="rePassword"
              value={formData.rePassword}
            />
          </div>

          <Button
            label="Signup"
            onClick={() => console.log("Signup clicked!")}
            padding="12px"
            color="white"
            fontSize="18px"
            width="100%"
            marginTop="10px"
          />
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
