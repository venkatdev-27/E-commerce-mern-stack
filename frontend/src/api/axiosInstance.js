import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});0

/* =========================
   REQUEST INTERCEPTOR
========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
axiosInstance.interceptors.response.use(
  (response) => response.data, // ✅ ALWAYS return data
  (error) => {
    console.error(
      `API failed → ${error.config?.url}`,
      error.response?.data || error.message
    );

    if (error.response?.status === 400) {
      // 🔥 FULL AUTH RESET (prevents crashes)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Server error";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
