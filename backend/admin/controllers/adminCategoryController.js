const mongoose = require("mongoose");
const Category = require("../../models/Category");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST,
} = require("../../utils/dateUtils");

/* ================================
   GET ALL CATEGORIES (ADMIN)
================================ */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      "_id name slug isActive description image createdAt updatedAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json(convertArrayTimestampsToIST(categories));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET ACTIVE CATEGORIES (USER)
================================ */
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      { isActive: true },
      "_id name slug image"
    )
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

    res.json(convertTimestampsToIST(category));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   CREATE CATEGORY (MULTER)
================================ */
const createCategory = async (req, res) => {
  try {
    const { name, slug, isActive, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const finalSlug =
      slug?.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/categories/${req.file.filename}`;
    } else if (image?.trim()) {
      imagePath = image.trim();
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || "",
      image: imagePath,
      isActive: isActive !== undefined ? isActive === "true" : true,
    });

    res.status(201).json(convertTimestampsToIST(category.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE CATEGORY (MULTER)
================================ */
const updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const { name, slug, isActive, description } = req.body;
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
      updateData.slug =
        slug?.trim() ||
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
    }

    if (slug !== undefined) updateData.slug = slug.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive === "true";

    if (req.file) {
      updateData.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(convertTimestampsToIST(category.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
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
  deleteCategory,
};
