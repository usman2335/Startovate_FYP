import React, { useState } from "react";
import SignupCard from "../components/SignupCard"; // Import the Card component
import Button from "../components/Button"; // Import your reusable Button component
import "../CSS/Signup.css";
import { TextField } from "@mui/material";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div className="signup-container">
      {/* Background Vector */}
      <div className="vector-background"></div>

      <SignupCard />

      <div className="signup-form">
        <h1>Logo</h1>
        <h2>Create your account now</h2>

        <form className="form1">
          <div className="signup-input-container">
            <label className="signup-input-label">Email</label>
            <TextField
              id="outlined-basic"
              label="Enter your email"
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="signup-input-container">
            <label className="signup-input-label">Password</label>
            <TextField
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              label="Enter your password"
              variant="outlined"
              fullWidth
            />
          </div>
          <Button
            label="Login"
            padding="12px"
            color="white"
            fontSize="18px"
            width="100%"
            marginTop="10px"
          />
        </form>

        <p>
          Create an New Account? <a href="/Signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
