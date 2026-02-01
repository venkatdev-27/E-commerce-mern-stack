const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/adminCategoryController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

// Ensure uploads/categories directory exists
const uploadDir = 'uploads/categories/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
    }
  }
});

/* =========================
   ADMIN CATEGORY ROUTES
========================= */

// 🔒 Protect all category routes
router.use(requireAdminAuth);

// 🧪 Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  next();
};

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories
 * @access  Admin
 */
router.get("/", getAllCategories);

/**
 * @route   POST /api/admin/categories
 * @desc    Create new category
 * @access  Admin
 */
router.post("/", upload.single('imageFile'), createCategory);

/**
 * @route   GET /api/admin/categories/:id
 * @desc    Get single category
 * @access  Admin
 */
router.get("/:id", validateObjectId, getCategory);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category
 * @access  Admin
 */
router.put("/:id", validateObjectId, upload.single('imageFile'), updateCategory);

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category
 * @access  Admin
 */
router.delete("/:id", validateObjectId, deleteCategory);

module.exports = router;
