import { NavLink } from "react-router-dom";
import logo from "../../public/assets/inventLogo.png";
import {
  AppstoreOutlined,
  WalletOutlined,
  TransactionOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Logout from "./LogoutButton";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/teacher",
      icon: <AppstoreOutlined />,
      end: true,
    },
    {
      name: "View Students",
      path: "/teacher/viewstudents",
      icon: <WalletOutlined />,
    },
    {
      name: "Manage Courses",
      path: "/teacher/managecourses",
      icon: <TransactionOutlined />,
    },
    {
      name: "Add Course",
      path: "/teacher/addcourses",
      icon: <TransactionOutlined />,
    },
    {
      name: "Course Feedback",
      path: "/teacher/feedback",
      icon: <MessageOutlined />,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-[#e5e7eb] h-screen shadow-premium">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#e5e7eb]">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-premium-red font-semibold"
                      : "text-[#535353] hover:bg-[#fee2e2] hover:text-[#dc2626] font-medium"
                  }`
                }
              >
                <span className="text-xl flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-[#e5e7eb]">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
