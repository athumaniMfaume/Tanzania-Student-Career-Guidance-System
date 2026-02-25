import axios from "axios";

const api = axios.create({
  // import.meta.env.PROD is a built-in Vite boolean
  // It is true on Render and false on your local machine
  baseURL: import.meta.env.PROD 
    ? "/api" 
    : "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
