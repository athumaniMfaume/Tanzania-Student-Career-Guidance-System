import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- automatically switches between dev/prod
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;