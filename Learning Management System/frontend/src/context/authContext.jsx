import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState([]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/users/getUser`,
        {
          withCredentials: true,
        }
      );
      const helo = response.data;
      console.log("hello", helo);
      setUser(helo);

      console.log("user is", response.data.role);
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
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    console.log("AuthContext mounted, calling checkAuthStatus");
    checkAuthStatus();
  }, []);
  useEffect(() => {
    console.log("✅ User value changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
