const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { apiLimiter } = require("../middleware/rateLimiter");

// Apply rate limiter to all order routes
router.use(apiLimiter);
const requireAuth = require("../middleware/auth");
const {
  placeOrder,
  getOrders,
  getOrderById,
  submitReview,
} = require("../controllers/orderController");

// 🔒 Generic ObjectId validator
const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  next();
};

/* =========================
   PLACE ORDER
========================= */
router.post("/", requireAuth, placeOrder);

/* =========================
   GET USER ORDERS
========================= */
router.get("/", requireAuth, getOrders);

/* =========================
   GET ORDER BY ID
========================= */
router.get(
  "/:orderId",
  requireAuth,
  validateObjectId("orderId"),
  getOrderById
);

/* =========================
   TRACK ORDER (alias)
========================= */
router.get(
  "/track/:orderId",
  requireAuth,
  validateObjectId("orderId"),
  getOrderById
);

/* =========================
   SUBMIT REVIEW FOR ORDER
========================= */
router.post(
  "/:orderId/review",
  requireAuth,
  validateObjectId("orderId"),
  submitReview
);

module.exports = router;
