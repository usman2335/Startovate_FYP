import React from 'react'
import "../CSS/HowItWorks.css"
import Button from './Button'

const HowItWorks = () => {
    const handleClick = () => {
        alert("button was clicked again")
    }
  return (
    <div className="how-it-works">
        <div className="contentwrapper">
        <div className="content-left">
            <h4>HOW STARTOVATE WORKS</h4>
            <h2>4 Simple Steps to Create Your Lean Canvas</h2>
            <p>Easily complete your Lean Canvas with guided checklists and templates. Create and export your business plan in just a few simple steps!</p>
            <Button label = "GET STARTED ->" onClick={handleClick} padding = "5% 10%" color = "#f1f1f1" fontSize={"1.3em"} width={"60%"} marginTop = {"5%"}></Button>

        </div>
        <div className="content-right">
            <div className = "row">
                <div className='number-text flex'  style = {{display: "flex" ,justifyContent: "flex-start"}}>
                    <img src='src\assets\1.png'></img>
                    <div className='instr-text flex-col'>
                    <h3>Select a Lean Canvas Component</h3>
                    <p>Choose a component from the Lean Canvas to begin.</p>
                    </div>
                    <img src = "src\assets\arrow1.svg"></img>
                </div>
            </div>
            <div className = "row">
            <div className='number-text flex'>
            <img src = "src\assets\arrow2.svg"></img>
                    <img src='src\assets\2.png'></img>
                    <div className='instr-text flex-col'>
                    <h3>Fill Out the Checklist</h3>
                    <p>A checklist will guide you through the important aspects of that component.</p>
                    </div>
                   
                </div>
            </div>
            <div className = "row">
            <div className='number-text flex'  style = {{display: "flex" ,justifyContent: "flex-start"}}>
                    <img src='src\assets\3.png'></img>
                    <div className='instr-text flex-col'>
                    <h3>Complete the Template</h3>
                    <p>Use the checklist to fill out the corresponding template for that component.</p>
                    </div>
                </div>
            </div>
            <div className = "row row4">
            <div className='number-text flex'  style = {{display: "flex" ,justifyContent: "flex-start"}}>
                <img src = "src\assets\arrow3.svg"></img>
                    <img src='src\assets\4.png'></img>
                    <div className='instr-text flex-col'>
                    <h3>Export Your Canvas</h3>
                    <p>Once all components are filled, generate and export your completed Lean Canvas as a Word document</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    </div>
  )
}

export default HowItWorks