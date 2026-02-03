const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminCategoryController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");
const upload = require("../../config/multer"); // ✅ USE EXISTING MULTER

/* =========================
   ADMIN AUTH
========================= */
router.use(requireAdminAuth);

/* =========================
   OBJECT ID VALIDATION
========================= */
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  next();
};

/* =========================
   ADMIN CATEGORY ROUTES
========================= */

// 📦 Get all categories
router.get("/", getAllCategories);

// ➕ Create category (image upload)
router.post(
  "/",
  upload.single("image"),
  createCategory
);

// 📄 Get single category
router.get(
  "/:id",
  validateObjectId,
  getCategory
);

// ✏️ Update category (image optional)
router.put(
  "/:id",
  validateObjectId,
  upload.single("image"),
  updateCategory
);

// ❌ Delete category
router.delete(
  "/:id",
  validateObjectId,
  deleteCategory
);

module.exports = router;
