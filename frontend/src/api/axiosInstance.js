import axios from "axios";

const BASE_URL =  import.meta.env.VITE_API_URL || "http://localhost:5000";



if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined. Check Render env variables.");
}

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to show toast - we'll import this dynamically to avoid circular imports
let addToast = null;
const loadToast = async () => {
  if (!addToast) {
    try {
      const { useToast } = await import("../../context/ToastContext");
      // Since we can't use hooks here, we'll need to get the toast function from a global reference
      // For now, we'll console.log and later we can improve this
    } catch (e) {
      console.warn("Toast context not available");
    }
  }
};
loadToast();

/* =========================
   REQUEST INTERCEPTOR
========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
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
  (response) => response.data, // 🔥 ALWAYS return data
  (error) => {
    console.error(
      `API request failed → ${error.config?.url}`,
      error.message
    );

    if (error.response?.status === 401) {
      localStorage.clear();
      return Promise.reject(new Error("Unauthorized"));
    }

    const message =
      error.response?.data?.message || error.message || "Server error";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
