import axios from "axios";

// Check if we are running in development (localhost)
const isDevelopment = window.location.hostname === "localhost";

const api = axios.create({
  // In development, use the backend port. In production, use the current origin.
  baseURL: isDevelopment 
    ? "http://localhost:5000/api" 
    : `${window.location.origin}/api`,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
