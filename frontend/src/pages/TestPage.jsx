import React from "react";
import Navbar from "../components/Navbar";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import Template1 from "../components/Templates/Template1";
import Checklist1 from "../components/Checklist1";
import ProblemInvestigation from "../components/Templates/Template3";
import StakeholderMapping from "../components/Templates/Template2";

const TestPage = () => {
  return (
    <>
      <Navbar />
      <div >
        {/* <Checklist1></Checklist1> */}
        {/* <Template1></Template1> */}
        <ProblemInvestigation></ProblemInvestigation>
        {/* <StakeholderMapping></StakeholderMapping> */}
      </div>
      </>
  );
};

export default TestPage;
