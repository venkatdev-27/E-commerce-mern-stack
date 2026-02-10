const express = require("express");
const router = express.Router();
const { apiLimiter } = require("../middleware/rateLimiter");
const { getCategories } = require("../controllers/categoryController");

// Apply rate limiter to all category routes
router.use(apiLimiter);

/* ================================
   GET ALL CATEGORIES (USER)
================================ */
router.get("/", getCategories);

module.exports = router;
