import React from "react";
import { Link } from "react-router-dom";
import courses from "../data/CourseData";
import "../CSS/Content.css"; // ✅ this should include your provided CSS

const ContentDisplay = () => (
  <section className="content-display" id="content">
    <div className="vector-bg-circle"></div>
    <div className="vector-bg-rotated"></div>
    <div className="vector-bg-blob"></div>
    <h2>Featured Video Courses</h2>
    <div className="content-grid">
      {courses.map(course => (
        <div className="content-item" key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <Link to={`/courses/${course.id}`}>
            Start Course
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default ContentDisplay;
