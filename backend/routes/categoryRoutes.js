const express = require("express");
const router = express.Router();
const {
  getAllCategories,
} = require("../admin/controllers/adminCategoryController");

/* ================================
   GET ALL CATEGORIES (USER)
================================ */
router.get("/", getAllCategories);

module.exports = router;
