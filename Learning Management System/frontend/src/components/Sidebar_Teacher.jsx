import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";
import {
  AppstoreOutlined,
  WalletOutlined,
  TransactionOutlined,
  LineChartOutlined,
  ReadOutlined,
  BulbOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Button from "../components/Button";

const Sidebar = () => {
  const className = "h-10 pl-2";
  const menuItems = [
    {
      name: "Dashboard",
      path: "/teacher",
      icon: <AppstoreOutlined />,
      end: true,
    },
    {
      name: "Manage Students",
      path: "/teacher/managestudents",
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
  ];

  return (
    <div className="hidden md:block md:w-64 bg-#F7E1E1 text-white h-screen p-6 space-y-4">
      <img
        src={logo} // ✅ Use src, not path
        alt="Logo"
        className={`h-auto w-auto ${className}`}
      />
      <ul className="space-y-2 mt-6">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded  ${
                  isActive
                    ? "text-primary-blue font-semibold"
                    : "text-text-grey font-normal hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-2xl rounded ${
                      isActive
                        ? "filter drop-shadow-[0_4px_1.1px_rgba(58,61,242,0.25)]"
                        : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`rounded ${
                      isActive
                        ? "text-shadow-[0_4px_1.1px_rgba(58,61,242,0.25)]"
                        : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>

            {item.subItems && (
              <ul className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem.path}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block text-sm p-1 rounded ${
                          isActive
                            ? "text-primary-blue font-semibold"
                            : "text-text-grey hover:underline"
                        }`
                      }
                    >
                      {subItem.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li className="mt-6">
          <Link to="/">
            <Button text="Logout" color="bg-red-500 text-white" height="h-10" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
