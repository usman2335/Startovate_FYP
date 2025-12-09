import React, { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import "../CSS/Navbar.css";
import { AuthContext } from "../context/authContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const handleClick = () => {
  //   alert("Button Clicked");
  // };

  return (
    <>
      <div className={`wrapper flex ${scrolling ? "navbar-scrolled" : ""}`}>
        <div>
          <img src={"/assets/inventLogo.png"} alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          {user?.isSubscribed ? (
            <NavLink to="/Canvas" className="nav-link">
              Canvas
            </NavLink>
          ) : (
            <span
              className="nav-link disabled"
              onClick={() => alert("Please subscribe to access Canvas.")}
              style={{ cursor: "not-allowed", opacity: 0.5 }}
            >
              Canvas
            </span>
          )}
        </div>
        <div className="login-signup-btns flex">
          {user ? (
            <>
              <AccountCircleOutlinedIcon
                fontSize="large"
                sx={{ color: "#1f1f1f" }}
              />
              <p>{user.fullName}</p>

              <ExpandMoreIcon onClick={handleClick} />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <NavLink to="/Login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/Signup">
                <Button label="Sign Up" padding="20% 50%" />
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
