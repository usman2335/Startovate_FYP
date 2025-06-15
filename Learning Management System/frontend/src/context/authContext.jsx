import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/getUser",
        {
          withCredentials: true,
        }
      );
      const helo = response.data;
      console.log(helo);
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
        "http://localhost:5000/api/users/logout",
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
