const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminDashboardController");
const requireAdminAuth = require("../middleware/adminAuthMiddleware");

/* =========================
   ADMIN DASHBOARD ROUTES
========================= */

// 🔒 Protect all dashboard routes
router.use(requireAdminAuth);

// 📊 GET /api/admin/dashboard/stats
router.get("/stats", getDashboardStats);

module.exports = router;
