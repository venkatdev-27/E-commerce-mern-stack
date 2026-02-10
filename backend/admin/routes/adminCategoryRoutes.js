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

// ➕ Create category (Cloudinary – base64 image)
router.post("/", createCategory);

// 📄 Get single category
router.get("/:id", validateObjectId, getCategory);

// ✏️ Update category (Cloudinary – base64 image)
router.put("/:id", validateObjectId, updateCategory);

// ❌ Delete category
router.delete("/:id", validateObjectId, deleteCategory);

module.exports = router;
