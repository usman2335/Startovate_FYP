import React from 'react';
import "../CSS/Navbar.css"

const Navbar = () => {
  return (
    <>   
    <div className="wrapper flex">
     <div>
        {/* <img src = "src\assets\logo.svg" className='logo'></img> */}
        <h1>Logo</h1>
    </div>
    <div className='nav-links flex gap-1'>
        <a>Home</a>
        <a>Canvas</a>
        <a>Dashboard</a>
    </div>
    <div className="login-signup-btns flex">
        <a>Login</a>
        <a>Sign Up</a>
    </div>
    </div>
    </>

  )
}

export default Navbar