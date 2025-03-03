import React from 'react'
import "../CSS/WhyChooseUs.css"
import FeatureCard from './FeatureCard'

const WhyChooseUs = () => {
  return (
    <div className="main">
        <div className="content">
            <h1>Why Choose Startovate</h1>
            <div className="card-container">
                <FeatureCard
                 img = "src\assets\clipboard.png"
                 title="Predefined Templates & Checklists"
                 description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
                 />
                <FeatureCard
                 img = "src\assets\chatbot.png"
                 title="AI-Powered Chatbot for Assistance"
                 description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
                 />
                <FeatureCard
                 img = "src\assets\lms.png"
                 title="Learning Management System"
                 description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
                 />
            </div>
        </div>
    </div>
  )
}

export default WhyChooseUs