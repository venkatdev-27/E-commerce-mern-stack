import axiosInstance from "./axiosInstance";

// PASSWORD LOGIN
export const login = async (credentials) => {
  return await axiosInstance.post("/auth/login", credentials);
};

// SIGNUP
export const signup = async (userData) => {
  return await axiosInstance.post("/auth/signup", userData);
};

// SEND OTP
export const sendOTP = async (email) => {
  return await axiosInstance.post("/auth/send-otp", { email });
};

// VERIFY OTP
export const verifyOTP = async (otpToken, otp) => {
  return await axiosInstance.post("/api/auth/verify-otp", {
    otpToken,
    otp: String(otp),
  });
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  return await axiosInstance.post("/auth/forgot-password", { email });
};

// VERIFY RESET OTP
export const verifyResetOTP = async (otpToken, otp) => {
  return await axiosInstance.post("/auth/verify-reset-otp", {
    otpToken,
    otp: String(otp),
  });
};



// RESET PASSWORD
export const resetPassword = async (
  otpToken,
  otp,
  newPassword,
  confirmPassword
) => {
  return await axiosInstance.post("/auth/reset-password", {
    otpToken,
    otp: String(otp),
    newPassword,
    confirmPassword,
  });
};
