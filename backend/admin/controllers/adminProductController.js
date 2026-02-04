const mongoose = require("mongoose");
const Product = require("../../models/Product");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST
} = require("../../utils/dateUtils");

/* ================================
   GET ALL PRODUCTS (ADMIN)
================================ */
const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category = "" } = req.query;

    // Validate and sanitize query parameters
    page = Math.max(1, Math.floor(Number(page)) || 1);
    limit = Math.max(1, Math.min(100, Math.floor(Number(limit)) || 10)); // Limit between 1-100
    search = String(search || "").trim();
    category = String(category || "").trim();
    console.log("🔍 Admin getAllProducts Query:", { search, category, isValid: mongoose.Types.ObjectId.isValid(category) });

    let query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") }
      ];
    }

    // Add category filter
        if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("category", "name slug") // ✅ IMPORTANT
      .sort({ _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products: convertArrayTimestampsToIST(products),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Admin get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET SINGLE PRODUCT
================================ */
/* ================================
   GET SINGLE PRODUCT (ADMIN)
================================ */
const getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id)
      .populate("category", "name slug") // ✅ FIX
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(convertTimestampsToIST(product));
  } catch (error) {
    console.error("Admin get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   CREATE PRODUCT
================================ */
const createProduct = async (req, res) => {
  try {
    console.log("🔥 createProduct HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("Image type:", typeof req.body.image);

    const productData = { ...req.body };

    // 🔥 CLEANUP IMAGE FIELD (Robust)
    // Remove if it's "null", "undefined", empty string, or an object (that isn't our desired string)
    if (
      !productData.image ||
      productData.image === "null" ||
      productData.image === "undefined" ||
      (typeof productData.image === "object" && !req.file)
    ) {
      delete productData.image;
    }

    // ✅ FILE UPLOAD (multer)
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }

    // 🔢 custom numeric id (your logic)
    const lastProduct = await Product.findOne().sort({ id: -1 });
    productData.id = lastProduct ? String(Number(lastProduct.id) + 1) : "1";

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE PRODUCT
================================ */
const updateProduct = async (req, res) => {
  try {
    console.log("🔥 updateProduct HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("Image type:", typeof req.body.image);

    const updateData = { ...req.body };

    // ❌ remove broken image object
    // 🔥 CLEANUP IMAGE FIELD (Robust)
    // Remove if it's "null", "undefined", empty string, or an object (that isn't our desired string)
    if (
      !updateData.image ||
      updateData.image === "null" ||
      updateData.image === "undefined" ||
      (typeof updateData.image === "object" && !req.file)
    ) {
      delete updateData.image;
    }

    // ✅ new uploaded file
    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(product);
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   DELETE PRODUCT
================================ */
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
