import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/getUser",
        { withCredentials: true }
      );
      setUser(response.data.user);
      console.log("user is" + user);
    } catch (error) {
      console.log("User not authenticated");
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );

      setUser(null); // Remove user from state
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  useEffect(() => {
    console.log("AuthContext mounted, calling checkAuthStatus");
    checkAuthStatus();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
