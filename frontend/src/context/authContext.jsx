import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
  useEffect(() => {
    console.log("AuthContext mounted, calling checkAuthStatus");
    checkAuthStatus();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
