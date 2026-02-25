import axios from "axios";

// This check happens in the browser, it is 100% accurate
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const api = axios.create({
  baseURL: isLocal 
    ? "http://localhost:5000/api" 
    : "/api", // Use relative path in production
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
