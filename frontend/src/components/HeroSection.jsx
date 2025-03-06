import React from 'react'
import "../CSS/HeroSection.css"
import "../CSS/Utilities.css"
import Button from './Button';


const HeroSection = () => {
   const handleClick = () => {
        alert("button was clicked again")
    }
  return (
  <>
    <div className='content-wrapper flex'>
        <div className="hero-left">
            <h1>Streamline Your Startup Journey with <span className = "LC-text">Lean Canvas</span></h1>
            <p>Effortlessly create, manage, and refine your Lean Canvas with guided templates, AI assistance, and seamless document export – all in one platform.</p>
            <div className='btn'>
            <Button label = "GET STARTED ->" onClick={handleClick} padding = "3% 13%" color = "#f1f1f1" fontSize={"1.5em"} ></Button>
            </div>
        </div>
        <div className="hero-right">
            <div className='lean-canvas flex-col'>
                <div className="row flex">
                    <div className='lc-card'>II - Literature Search</div>
                    <div className='lc-card'> A - Existing Solutions</div>
                    <div className='lc-card'> B - Market Landscape</div>
                    <div className='lc-card'> C - Novelty</div>
                </div>
                <div className="row flex">
                    <div className='lc-card'> I - Problem Identification</div>
                    <div className='lc-card'> III - Research Question</div>
                    <div className='lc-card'> V - Research Outcome</div>
                </div>
                <div className="row flex">
                <div className='lc-card'>IV - Research Methodology</div>
                    <div className='lc-card'> D - Key Resources</div>
                    <div className='lc-card'> E - Funding</div>
                    <div className='lc-card'> F - Team Capacities</div>
                </div>
            </div>
        </div>
    </div>
    </>
    
  )
}

export default HeroSection