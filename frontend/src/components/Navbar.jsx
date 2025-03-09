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
      console.log("Current scroll position:", window.scrollY); // Debugging log
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    console.log("Scrolling state updated:", scrolling);
  }, [scrolling]);

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
        <div className="login-signup-btns flex">
          <a>Login</a>
          <Button label="Sign Up" onClick={handleClick} padding="10% 30%" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
