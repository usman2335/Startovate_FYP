import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
const LandingPage = () =>{
    return (
        <>
            <div>
                <Navbar></Navbar>
                <HeroSection/>
                <WhyChooseUs/>
                <HowItWorks/>
            </div>
        </>
    )
}

export default LandingPage;
