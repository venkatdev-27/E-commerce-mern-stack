const Category = require("../models/Category");

/* ================================
   GET ALL ACTIVE CATEGORIES (USER)
================================ */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      { isActive: true },
      "_id name slug image"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

module.exports = {
  getCategories,
};
