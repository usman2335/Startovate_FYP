import React from "react";
import SignupCard from "../components/SignupCard"; // Import the Card component
import Button from "../components/Button"; // Import your reusable Button component
import "../CSS/Signup.css";

const LoginPage = () => {
  return (
    <div className="signup-container">
      {/* Background Vector */}
      <div className="vector-background"></div>

      <SignupCard />

      <div className="signup-form">
        <h1>Logo</h1>
        <h3>Create your account now</h3>

        <form>
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <Button
            label="Login"
            onClick={() => console.log("Signup clicked!")}
            padding="12px"
            color="white"
            fontSize="18px"
            width="175%"
            marginTop="10px"
          />
        </form>

        <p>Create an New Account? <a href="/Signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
