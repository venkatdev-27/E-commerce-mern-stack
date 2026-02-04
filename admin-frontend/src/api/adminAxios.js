import axios from "axios";



const BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || "https://e-commerce-mern-stack-i66g.onrender.com";



if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined. Check Render env variables.");
}


const adminAxios = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  // ❌ Content-Type should NOT be forced to JSON, 
  // otherwise FormData (multipart) fails to set safe boundary!
  // headers: {
  //   "Content-Type": "application/json" 
  // }
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
