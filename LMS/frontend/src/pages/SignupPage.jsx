import React, { useState } from "react";
import SignupCard from "../components/SignupCard";
import Button from "../components/Button";
import "../CSS/Signup.css";
import { TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    role: "student", // Default role: user (i.e., student)
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
    console.log(formData);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
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
      name: validateField("name", formData.name),
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
        `${BACKEND_BASE_URL}/api/users/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

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
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.response?.data?.error || "Something went wrong!",
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="vector-background"></div>
      <SignupCard />

      <div className="signup-form">
        <h1>Logo</h1>
        <h2>Create your account now</h2>

        <form className="form1" onSubmit={handleSubmit}>
          <div className="signup-input-container">
            <label className="signup-input-label">Full Name</label>
            <TextField
              error={!!errors.name}
              helperText={errors.name}
              label="Enter your full name"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="name"
              value={formData.name}
            />
          </div>

          <div className="signup-input-container">
            <label className="signup-input-label">Email Address</label>
            <TextField
              error={!!errors.email}
              helperText={errors.email}
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
              label="Re-enter your password"
              type="password"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="rePassword"
              value={formData.rePassword}
            />
          </div>

          {/* Role Dropdown */}
          <div className="signup-input-container">
            <label className="signup-input-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="signup-role-select"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
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

        <p style={{ marginTop: "3%" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
