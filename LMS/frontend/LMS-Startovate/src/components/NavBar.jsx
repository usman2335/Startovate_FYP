import React from "react";
import "../CSS/NavBar.css"; // Make sure this path is correct

const Header = () => {
  return (
    <header className="lms-header">
      <div className="lms-logo">Startovate LMS</div>
      <nav className="lms-nav">
        <ul>
          <li><a href="index.html" className="lms-link">Home</a></li>
          <li><a href="about.html" className="lms-link">Courses</a></li>
          <li><a href="contact.html" className="lms-link">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
