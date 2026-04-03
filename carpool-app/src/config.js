import axios from "axios";

// 🔥 FIXED BASE URL (no dependency on .env for now)
const API = "http://localhost:5000";

// 🔥 CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: API,
});

// 🔥 ATTACH TOKEN AUTOMATICALLY
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;