import React from "react";
import Navbar from "../components/Navbar";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import Template1 from "../components/Templates/Problem Identification/Template1";
import Checklist1 from "../components/Checklist1";

const TestPage = () => {
  return (
    <>
      <Navbar />
      <div>
        <Checklist1></Checklist1>
      </div>
    </>
  );
};

export default TestPage;
