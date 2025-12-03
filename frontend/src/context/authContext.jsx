import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/users/getUser`,
        { withCredentials: true }
      );
      setUser(response.data.user);
      console.log("user subscription is" + response.data.user.isSubscribed);
    } catch (error) {
      console.log("User not authenticated");
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      await axios.post(
        `${BACKEND_BASE_URL}/api/users/logout`,
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
