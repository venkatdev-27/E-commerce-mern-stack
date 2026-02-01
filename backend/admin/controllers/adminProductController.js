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
    if (category) {
      query.category = category;
    }

    let products = await Product.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Product.countDocuments(query);

    const productsWithIST = convertArrayTimestampsToIST(products);

    res.json({
      products: productsWithIST,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET SINGLE PRODUCT
================================ */
const getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productWithIST = convertTimestampsToIST(product);
    res.json(productWithIST);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   CREATE PRODUCT
================================ */
const createProduct = async (req, res) => {
  try {
    console.log('Create product request body:', req.body);
    console.log('Category value:', req.body.category);
    console.log('Category type:', typeof req.body.category);

    // Category is the name from frontend constants
    const productData = {
      ...req.body,
      category: req.body.category?.trim(), // Trim category to avoid spaces
    };

    // Generate a unique id for the product
    const existingProduct = await Product.findOne().sort({ id: -1 });
    let nextId = 1;
    if (existingProduct && existingProduct.id) {
      const lastId = parseInt(existingProduct.id);
      nextId = lastId + 1;
    }
    productData.id = String(nextId);

    const product = await Product.create(productData);

    // Don't populate category for create - just return basic product data
    const productWithIST = convertTimestampsToIST(product.toObject());
    res.status(201).json(productWithIST);
  } catch (error) {
    console.error('Create product error:', error);
    console.error('Error details:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE PRODUCT
================================ */
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Trim category if provided
    const updateData = { ...req.body };
    if (updateData.category) {
      updateData.category = updateData.category.trim();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productWithIST = convertTimestampsToIST(product);
    res.json(productWithIST);
  } catch (error) {
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
