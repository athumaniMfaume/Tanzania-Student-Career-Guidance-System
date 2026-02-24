import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // inactivity timeout in minutes (change as needed)
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
      // automatic logout on inactivity
      logout();
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  const activityHandler = () => {
    // reset timer on any user interaction
    if (user) startInactivityTimer();
  };

  // Load user safely from localStorage
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

  // Login
const login = async (email, password) => {
  const res = await axios.post(
    "http://localhost:5000/api/auth/login",
    { email, password }
  );

  const loggedUser = res.data.user;
  const token = res.data.token;

  const userWithToken = { ...loggedUser, token };

  setUser(userWithToken);
  localStorage.setItem("user", JSON.stringify(userWithToken));
};

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearInactivityTimer();
  };

  // Attach activity listeners when user is present
  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    if (user) {
      // start/reset timer
      startInactivityTimer();

      // add listeners
      events.forEach((ev) => window.addEventListener(ev, activityHandler));
    }

    return () => {
      // cleanup listeners and timer
      events.forEach((ev) => window.removeEventListener(ev, activityHandler));
      clearInactivityTimer();
    };
  }, [user]);

  // Show loading screen while checking localStorage
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