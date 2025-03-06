import React from "react";
import SignupCard from "../components/SignupCard"; // Import the Card component
import Button from "../components/Button"; // Import your reusable Button component
import "../CSS/Signup.css";

const SignupPage = () => {
  return (
    <div className="signup-container">
      {/* Background Vector */}
      <div className="vector-background"></div>

      <SignupCard />

      <div className="signup-form">
        <h1>Logo</h1>
        <h2>Create your account now</h2>

        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <Button
            label="Signup"
            onClick={() => console.log("Signup clicked!")}
            padding="12px"
            color="white"
            fontSize="18px"
            width="175%"
            marginTop="10px"
          />
        </form>

        <p>Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
