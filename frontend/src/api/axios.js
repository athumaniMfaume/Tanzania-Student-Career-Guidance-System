import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://tanzania-student-career-guidance-system.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;