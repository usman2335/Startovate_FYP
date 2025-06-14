import React from "react";
import { Routes, Route } from "react-router-dom";
import ContentDisplay from "./components/ContentDisplay";
import CoursePlayer from "./pages/CoursePlayer";
import NavBar from "./components/NavBar";
import LMSLanding from "./pages/LMS_Landing"; // adjust the path as needed

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LMSLanding />} />
        <Route path="/courses" element={<ContentDisplay />} />
        <Route path="/courses/:courseId" element={<CoursePlayer />} />
      </Routes>
    </>
  );
};

export default App;
