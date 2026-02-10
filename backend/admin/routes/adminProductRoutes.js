const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

/* =========================
   ADMIN PRODUCT ROUTES
========================= */

// 🔒 Protect all product routes
router.use(requireAdminAuth);

// 📦 Get all products
router.get("/", getAllProducts);

// ➕ Create product (Cloudinary – Base64)
router.post("/", createProduct);

// 📄 Get single product
router.get("/:id", getProduct);

// ✏️ Update product (Cloudinary – Base64)
router.put("/:id", updateProduct);

// ❌ Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
