import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/auth/profile");
          setUser(data);
        } catch (error) {
          localStorage.removeItem("token");
          console.error("Failed to load user session. It may have expired.");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // --- ADDED REGISTER FUNCTION ---
  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
