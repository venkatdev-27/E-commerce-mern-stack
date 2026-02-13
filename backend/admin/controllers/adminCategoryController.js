const mongoose = require("mongoose");
const Category = require("../../models/Category");
const cloudinary = require("cloudinary").v2;
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST,
} = require("../../utils/dateUtils");

// Configure cloudinary directly in the controller
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
   CREATE CATEGORY (CLOUDINARY)
================================ */
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!image) {
      return res.status(400).json({ message: "Category image is required" });
    }

    const finalSlug =
      slug?.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const upload = await cloudinary.uploader.upload(image, {
      folder: "luxemarket/categories",
    });

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || "",
      isActive: isActive !== undefined ? isActive === "true" : true,
      image: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });

    res.status(201).json(convertTimestampsToIST(category.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    if (error.message && error.message.includes("Cloudinary")) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }
    res.status(500).json({ message: error.message || "Failed to create category" });
  }
};

/* ================================
   UPDATE CATEGORY (CLOUDINARY)
================================ */
const updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, slug, description, isActive, image } = req.body;

    if (name !== undefined) {
      category.name = name.trim();
      category.slug =
        slug?.trim() ||
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
    }

    if (description !== undefined) category.description = description.trim();
    if (isActive !== undefined) category.isActive = isActive === "true";

    // 🔄 Replace image if provided
    if (image && image !== category.image?.url) {
      try {
        if (category.image?.public_id) {
          await cloudinary.uploader.destroy(category.image.public_id);
        }

        const upload = await cloudinary.uploader.upload(image, {
          folder: "luxemarket/categories",
        });

        category.image = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    await category.save();
    res.json(convertTimestampsToIST(category.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE CATEGORY (CLOUDINARY)
================================ */
const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 🗑 Delete image from Cloudinary
    if (category.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
        // Continue with deletion even if image deletion fails
      }
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message || "Failed to delete category" });
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
