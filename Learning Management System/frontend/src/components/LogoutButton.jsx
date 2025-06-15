// src/components/Logout.jsx
import React from "react";
import { Button } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear localStorage
        localStorage.removeItem("user");

        // Clear cookies (e.g., auth token)
        Cookies.remove("token"); // Adjust the name if your token cookie has a different name
        Cookies.remove("connect.sid"); // If using express-session

        Swal.fire({
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => navigate("/login"), 1500); // Redirect to login
      }
    });
  };

  return (
    <Button danger type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
