const express = require("express");
const router = express.Router();
const { adminLimiter } = require("../../middleware/rateLimiter");

// Apply rate limiter
router.use(adminLimiter);

const {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require("../controllers/adminOrderController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

/* =========================
   ADMIN ORDER ROUTES
========================= */

// 🔒 Protect all order routes
router.use(requireAdminAuth);

// 📊 Order statistics (MUST be before :id)
router.get("/stats/overview", getOrderStats);

// 📦 Get all orders
router.get("/", getAllOrders);

// 📄 Get single order
router.get("/:id", getOrder);

// 🔄 Update order status
router.put("/:id/status", updateOrderStatus);

module.exports = router;
