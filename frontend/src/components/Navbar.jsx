import React, { useEffect, useState } from "react";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import "../CSS/Navbar.css";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    alert("Button Clicked");
  };

  return (
    <>
      <div className={`wrapper flex ${scrolling ? "navbar-scrolled" : ""}`}>
        <div>
          <h1>Logo</h1>
        </div>
        <div className="nav-links flex gap-1">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/Canvas" className="nav-link">
            Canvas
          </NavLink>
          <NavLink to="/Dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </div>
        <div className="login-signup-btns flex nav-links">
          <NavLink to="/Login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/Signup">
            <Button label="Sign Up" padding="10% 30%" />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
