const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/adminProductController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");
const upload = require("../../config/multer");

/* =========================
   ADMIN PRODUCT ROUTES
========================= */

// 🔒 Protect all product routes
router.use(requireAdminAuth);

// 📦 Get all products
router.get("/", getAllProducts);

// ➕ Create product (WITH IMAGE)
router.post("/", upload.single("image"), createProduct);

// 📄 Get single product
router.get("/:id", getProduct);

// ✏️ Update product (WITH IMAGE)
router.put("/:id", upload.single("image"), updateProduct);

// ❌ Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
