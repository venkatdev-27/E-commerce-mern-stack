import axiosInstance from './axiosInstance';

/* =========================
   AUTH API
========================= */
export const login = (credentials) =>
  axiosInstance.post("/auth/login", credentials);

export const register = (userData) =>
  axiosInstance.post("/auth/signup", userData);

export const sendOTP = (email) =>
  axiosInstance.post("/auth/send-otp", { email });

export const verifyOTP = (otpToken, otp) =>
  axiosInstance.post("/auth/verify-otp", { otpToken, otp });

export const forgotPassword = (email) =>
  axiosInstance.post("/auth/forgot-password", { email });

export const verifyResetOTP = (otpToken, otp) =>
  axiosInstance.post("/auth/verify-reset-otp", { otpToken, otp });

export const resetPassword = (otpToken, otp, newPassword, confirmPassword) =>
  axiosInstance.post("/auth/reset-password", { otpToken, otp, newPassword, confirmPassword });
