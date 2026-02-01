const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword
} = require("../controllers/authController");

const requireAuth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.get("/profile", requireAuth, getProfile);

module.exports = router;
