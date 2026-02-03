const express = require("express");
const router = express.Router();

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
router.post("/signup", signup);
router.post("/login", login);

// OTP login
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Forgot password (NO AUTH)
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password", verifyResetPassword);

/* ================= PROTECTED ROUTES ================= */
router.get("/profile", requireAuth, getProfile);

module.exports = router;
