const express = require("express");
const router = express.Router();

const {
  getProducts,
  searchProducts,
  getProductById,
  getBrands,
} = require("../controllers/productController");

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
