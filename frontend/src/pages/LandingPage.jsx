import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyChooseUs from "../components/WhyChooseUs";
const LandingPage = () =>{
    return (
        <>
            <div>
                <Navbar></Navbar>
                <HeroSection/>
                <WhyChooseUs/>
            </div>
        </>
    )
}

export default LandingPage;
