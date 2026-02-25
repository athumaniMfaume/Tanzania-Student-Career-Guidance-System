const axios = require("axios").default;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // picks dev or prod automatically
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

module.exports = api;