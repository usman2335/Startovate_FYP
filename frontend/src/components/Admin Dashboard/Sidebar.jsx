import React from "react";
import { NavLink } from "react-router-dom";
import "../CSS/Sidebar.css"; // Adjust the path as necessary

const Sidebar = () => {
  const menuItems = [
    { name: "Manage Teachers", path: "/admin/manage-teachers" },
    { name: "Manage Students", path: "/admin/manage-students" },
    { name: "Manage Courses", path: "/admin/manage-courses" },
    { name: "Course Approvals", path: "/admin/course-approvals" },
    { name: "Payments", path: "/admin/payments" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Startovate</div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
s;
