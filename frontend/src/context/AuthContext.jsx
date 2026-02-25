import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../api/axios"; // ✅ use your configured axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const INACTIVITY_MINUTES = 15;
  const timerRef = useRef(null);

  const clearInactivityTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startInactivityTimer = () => {
    clearInactivityTimer();
    timerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  const activityHandler = () => {
    if (user) startInactivityTimer();
  };

  // Load user from localStorage safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Invalid user in localStorage. Clearing it.");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN (FIXED — no localhost)
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const loggedUser = res.data.user;
      const token = res.data.token;

      const userWithToken = { ...loggedUser, token };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearInactivityTimer();
  };

  // Activity listeners
  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    if (user) {
      startInactivityTimer();
      events.forEach((ev) =>
        window.addEventListener(ev, activityHandler)
      );
    }

    return () => {
      events.forEach((ev) =>
        window.removeEventListener(ev, activityHandler)
      );
      clearInactivityTimer();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};