import React from "react";
import "../CSS/WhyChooseUs.css";
import FeatureCard from "./FeatureCard";

const WhyChooseUs = () => {
  return (
    <div className="main">
      <div className="content">
        <h1>Why Choose Startovate</h1>
        <div className="card-container">
          <FeatureCard
            img="/assets/clipboard.png"
            title="Predefined Templates & Checklists"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
          />
          <FeatureCard
            img="/assets/chatbot.png"
            title="AI-Powered Chatbot for Assistance"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
          />
          <FeatureCard
            img="/assets/lms.png"
            title="Learning Management System"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
          />
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
