import React from "react";
import SignupCard from "../components/SignupCard"; // Import the Card component
import Button from "../components/Button"; // Import your reusable Button component
import "../CSS/Signup.css";
import { TextField } from "@mui/material";

const SignupPage = () => {
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
            <label className="signup-input-label">Full Name</label>
            {/* <input type="text" placeholder="Enter your full name" /> */}
            <TextField
              id="outlined-basic"
              label="Enter your full name"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="signup-input-container">
            <label className="signup-input-label">Email Address</label>
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
              label="Enter your password"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="signup-input-container">
            <label className="signup-input-label">Re-Enter Password</label>

            <TextField
              id="outlined-basic"
              label="Re-enter your password"
              variant="outlined"
              fullWidth
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
