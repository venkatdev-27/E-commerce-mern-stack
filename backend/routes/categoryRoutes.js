const express = require("express");
const router = express.Router();
const { apiLimiter } = require("../middleware/rateLimiter");
const {
  getActiveCategories,
} = require("../admin/controllers/adminCategoryController");

/* ================================
   GET ALL CATEGORIES (USER)
================================ */
router.get("/", getActiveCategories);

module.exports = router;

