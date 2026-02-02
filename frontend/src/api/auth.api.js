import axiosInstance from "@/api/axiosInstance";

/* =========================
   AUTH API
========================= */

// PASSWORD LOGIN
export const login = (credentials) => {
  return axiosInstance.post("/auth/login", credentials);
};

// SIGNUP
export const signup = (userData) => {
  return axiosInstance.post("/auth/signup", userData);
};

// SEND OTP (LOGIN)
export const sendOTP = (email) => {
  return axiosInstance.post("/auth/send-otp", { email });
};

// VERIFY OTP (LOGIN)
export const verifyOTP = (otpToken, otp) => {
  return axiosInstance.post("/auth/verify-otp", {
    otpToken,
    otp,
  });
};

// FORGOT PASSWORD
export const forgotPassword = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

// VERIFY RESET OTP
export const verifyResetOTP = (otpToken, otp) => {
  return axiosInstance.post("/auth/verify-reset-otp", {
    otpToken,
    otp,
  });
};

// RESET PASSWORD
export const resetPassword = (
  otpToken,
  otp,
  newPassword,
  confirmPassword
) => {
  return axiosInstance.post("/auth/reset-password", {
    otpToken,
    otp,
    newPassword,
    confirmPassword,
  });
};
