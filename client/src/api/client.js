import axios from "axios";

const normalizeApiBaseUrl = (url) => {
  const base = (url || "http://localhost:5000").replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wealthwave-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;