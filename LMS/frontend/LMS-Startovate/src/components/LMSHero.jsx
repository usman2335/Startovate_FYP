import React from "react";
import { Link } from "react-router-dom";
import "../CSS/LMSHero.css"; // Make sure to import your CSS

const HeroSection = () => {
  return (
    <section className="lms-hero">
      {/* Background Vector Shapes */}
      <div className="vector-bg-circle"></div>
      <div className="vector-bg-rotated"></div>
      <div className="vector-bg-blob"></div>

      {/* Hero Content */}
      <div className="lms-hero-content">
        <h1>Empowering Learning, One Click at a Time</h1>
        <p>
          Access expert-crafted educational resources designed for every stage of learning.
          Whether you're a student, educator, or lifelong learner — we've got something for you.
        </p>

        {/* React Router Link to /courses */}
        <Link to="/courses" className="lms-btn">
          Explore Courses
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
