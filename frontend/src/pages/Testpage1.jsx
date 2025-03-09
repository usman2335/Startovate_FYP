import React from 'react'
import Navbar from "../components/Navbar";
import Checklist from '../components/Checklist1';

const Testpage1 = () => {
    const stepsData = [
        { id: 1, title: "Step 1", description: "Identify the problem", completed: true },
        { id: 2, title: "Step 2", description: "Analyze causes", completed: false },
        { id: 3, title: "Step 3", description: "Analyze causes but i cannot understand how is this working completly fine", completed: true },
        { id: 4, title: "Step 4", description: "Analyze causes", completed: false },
        { id: 5, title: "Step 5", description: "Analyze causes", completed: false },
        { id: 6, title: "Step 6", description: "Analyze causes", completed: true },
        { id: 7, title: "Step 7", description: "Analyze causes", completed: false },
        
      ];
  return (
    <>
    <Navbar />
      <Checklist title="Project Steps" steps={stepsData} />
    {/* <CreateNewCanvasModal /> */}
  </>
  )
}

export default Testpage1;
