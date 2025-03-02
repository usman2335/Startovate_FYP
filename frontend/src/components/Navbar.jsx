import React from 'react';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import "../CSS/Navbar.css"

const Navbar = () => {
    const handleClick = () => {
        alert("Button Clicked");
    }
  return (
    <>   
    <div className="wrapper flex">
        <div>
            {/* <img src = "src\assets\logo.svg" className='logo'></img> */}
            <h1>Logo</h1>
        </div>
        <div className='nav-links flex gap-1'>
            <NavLink to = "/" className="nav-link">Home</NavLink>
            <NavLink to = "/Canvas" className="nav-link">Canvas</NavLink>
            <NavLink to = "/Dashboard" className="nav-link">Dashboard</NavLink>
        </div>
        <div className="login-signup-btns flex">
            <a>Login</a>
            <Button label = "Sign Up" onClick={handleClick} padding = "10% 30%"></Button>
        </div>
    </div>
    </>

  )
}

export default Navbar