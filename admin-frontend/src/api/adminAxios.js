import axios from "axios";

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid
      localStorage.removeItem("adminToken");

      // Hard redirect to login (safe everywhere)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
