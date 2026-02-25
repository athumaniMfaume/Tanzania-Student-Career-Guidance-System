import axios from "axios";

// Automatically switch base URL
const api = axios.create({
  baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api" // Local dev
    : "https://tanzania-student-career-guidance-system.onrender.com//api", // Production (same domain)
});

// Attach auth token if exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;