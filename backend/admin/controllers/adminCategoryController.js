const mongoose = require("mongoose");
const Category = require("../../models/Category");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST
} = require("../../utils/dateUtils");

/* ================================
   GET ALL CATEGORIES (ADMIN)
================================ */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, '_id name slug icon isActive description image createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const categoriesWithIST = convertArrayTimestampsToIST(categories);
    res.json(categoriesWithIST);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET ACTIVE CATEGORIES (USER)
================================ */
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }, '_id name slug icon image')
      .sort({ createdAt: -1 })
      .lean();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET SINGLE CATEGORY
================================ */
const getCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryWithIST = convertTimestampsToIST(category);
    res.json(categoryWithIST);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   CREATE CATEGORY
================================ */
const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, isActive, description, image } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!icon || icon.trim() === "") {
      return res.status(400).json({ message: "Category icon is required" });
    }

    // Auto-generate slug if not provided
    let categorySlug = slug?.trim();
    if (!categorySlug) {
      categorySlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Handle image - prefer uploaded file over URL
    let imagePath = image?.trim() || "";
    if (req.file) {
      imagePath = `/uploads/categories/${req.file.filename}`;
    }

    // Create category
    const categoryData = {
      name: name.trim(),
      slug: categorySlug,
      icon: icon.trim(),
      isActive: isActive !== undefined ? isActive : true,
      description: description?.trim() || "",
      image: imagePath
    };

    const category = await Category.create(categoryData);
    const categoryWithIST = convertTimestampsToIST(category.toObject());

    res.status(201).json(categoryWithIST);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Category ${field} already exists`
      });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE CATEGORY
================================ */
const updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const { name, slug, icon, isActive, description, image } = req.body;
    const updateData = {};

    // Handle optional fields
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (icon !== undefined) updateData.icon = icon.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (description !== undefined) updateData.description = description.trim();

    // Handle image - prefer uploaded file over URL
    if (req.file) {
      updateData.image = `/uploads/categories/${req.file.filename}`;
    } else if (image !== undefined) {
      updateData.image = image?.trim() || "";
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryWithIST = convertTimestampsToIST(category.toObject());
    res.json(categoryWithIST);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Category ${field} already exists`
      });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE CATEGORY
================================ */
const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getActiveCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
