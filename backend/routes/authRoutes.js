const express = require("express");
const router = express.Router();
const { authLimiter } = require("../middleware/rateLimiter");

const {
  signup,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getProfile,
  verifyResetPassword,
} = require("../controllers/authController");

const requireAuth = require("../middleware/auth");

/* ================= PUBLIC ROUTES ================= */
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

// OTP login
router.post("/send-otp", authLimiter, sendOTP);
router.post("/verify-otp", authLimiter, verifyOTP);

// Forgot password (NO AUTH)
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-reset-otp", authLimiter, verifyResetOTP);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/verify-reset-password", verifyResetPassword);

/* ================= PROTECTED ROUTES ================= */
router.get("/profile", requireAuth, getProfile);

module.exports = router;
