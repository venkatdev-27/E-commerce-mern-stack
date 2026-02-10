const express = require("express");
const router = express.Router();
const { adminLimiter } = require("../../middleware/rateLimiter");

const {
  registerAdmin,
  loginAdmin,
  getProfile
} = require("../controllers/adminAuthController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

// Apply rate limiter to all admin routes
router.use(adminLimiter);

/* =========================
   ADMIN AUTH ROUTES
========================= */

// PUBLIC (use once)
router.post("/register", registerAdmin);

// PUBLIC
router.post("/login", loginAdmin);

// PROTECTED
router.get("/profile", requireAdminAuth, getProfile);

module.exports = router;
