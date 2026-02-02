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
  deleteCategory,
} = require("../controllers/adminCategoryController");

const requireAdminAuth = require("../middleware/adminAuthMiddleware");

/* ======================================
   ENSURE UPLOAD DIRECTORY EXISTS
====================================== */
const uploadDir = path.join("uploads", "categories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================
   MULTER CONFIG (IMAGE ONLY)
====================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `category-${unique}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const extOk = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = allowed.test(file.mimetype);

    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP, and SVG files are allowed"
        )
      );
    }
  },
});

/* ======================================
   MIDDLEWARES
====================================== */

// 🔒 Protect all admin category routes
router.use(requireAdminAuth);

// 🧪 Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ message: "Invalid category ID" });
  }
  next();
};

/* ======================================
   ADMIN CATEGORY ROUTES
====================================== */

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories (admin)
 * @access  Admin
 */
router.get("/", getAllCategories);

/**
 * @route   POST /api/admin/categories
 * @desc    Create category (image required)
 * @access  Admin
 */
router.post(
  "/",
  upload.single("image"),
  createCategory
);

/**
 * @route   GET /api/admin/categories/:id
 * @desc    Get single category
 * @access  Admin
 */
router.get(
  "/:id",
  validateObjectId,
  getCategory
);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category (image optional)
 * @access  Admin
 */
router.put(
  "/:id",
  validateObjectId,
  upload.single("image"),
  updateCategory
);

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category
 * @access  Admin
 */
router.delete(
  "/:id",
  validateObjectId,
  deleteCategory
);

module.exports = router;
