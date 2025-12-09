import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
        <HeroSection />
        <WhyChooseUs />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
