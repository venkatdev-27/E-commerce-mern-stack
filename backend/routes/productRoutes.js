const express = require("express");
const router = express.Router();
const { apiLimiter } = require("../middleware/rateLimiter");

const {
  getProducts,
  searchProducts,
  getProductById,
  getBrands,
} = require("../controllers/productController");

// Apply rate limiter to all product routes
router.use(apiLimiter);

/* =========================
   🔍 REAL SEARCH (MUST BE FIRST)
========================= */

router.get("/search", searchProducts);

/* =========================
   PRODUCT META FILTERS
========================= */
router.get("/meta/brands", getBrands);

/* =========================
   PRODUCT LIST (FILTERS + PAGINATION)
========================= */
router.get("/", getProducts);

/* =========================
   SINGLE PRODUCT (KEEP LAST)
========================= */
router.get("/:id", getProductById);

module.exports = router;
