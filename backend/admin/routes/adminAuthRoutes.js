const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getProfile
} = require("../controllers/adminAuthController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

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
