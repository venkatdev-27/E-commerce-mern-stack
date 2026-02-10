const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST,
} = require("../utils/dateUtils");


/* =====================================================
   GET PRODUCTS (FILTER + SEARCH + SORT + PAGINATION)
===================================================== */
const getProducts = async (req, res) => {
      
  try {


    const {
      category = "all",
      search = "",
      brands = "",
      minPrice = 0,
      maxPrice = 100000,
      sortBy = "recommended",
      page = 1,
      limit = 50,
    } = req.query;

    let query = {};

    /* ---------- SEARCH ---------- */
    if (search.trim()) {
      const tokens = search.trim().split(/\s+/);
      query.$and = tokens.map((token) => ({
        $or: [
          { name: new RegExp(token, "i") },
          { description: new RegExp(token, "i") },
          { subCategory: new RegExp(token, "i") },
          { brand: new RegExp(token, "i") },
        ],
      }));
    }

    /* ---------- CATEGORY (SLUG OR ObjectId) ---------- */
    if (category && category !== "all" && category !== "recommended") {
      let categoryId = category;

      // If NOT a valid ObjectId, try to find by slug
      if (!mongoose.Types.ObjectId.isValid(category)) {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          categoryId = categoryDoc._id;
        } else {
          // ❌ Invalid slug AND invalid ID → return empty results
          return res.json({
            success: true,
            products: [],
            total: 0,
            page: Number(page),
            pages: 0,
            hasMore: false,
          });
        }
      }

      // ✅ Apply valid Category ID (either direct or resolved from slug)
      query.category = categoryId;
    }


    /* ---------- RECOMMENDED ---------- */
    if (category === "recommended") {
      query.$or = [
        { rating: { $gte: 4 } },
        { discount: { $gte: 20 } },
      ];
    }

    /* ---------- BRAND ---------- */
    if (brands.trim()) {
      query.brand = { $in: brands.split(",").map((b) => b.trim()) };
    }

    /* ---------- PRICE ---------- */
    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };

    /* ---------- SORT ---------- */
    let sortOptions = { createdAt: -1 };
    if (sortBy === "price-low-high") sortOptions = { price: 1 };
    else if (sortBy === "price-high-low") sortOptions = { price: -1 };
    else if (sortBy === "rating") sortOptions = { rating: -1 };



    /* ---------- PAGINATION ---------- */
    const pageInt = Math.max(1, Number(page));
    const limitInt = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageInt - 1) * limitInt;

const products = await Product.find(query)
  .populate("category", "name slug") // ✅ ADD THIS
  .sort(sortOptions)
  .limit(limitInt)
  .skip(skip)
  .lean();


    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products: convertArrayTimestampsToIST(products),
      total,
      page: pageInt,
      pages: Math.ceil(total / limitInt),
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id)
      .populate("category", "name slug") // ✅ CORRECT
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(convertTimestampsToIST(product));
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET BRANDS
===================================================== */
const getBrands = async (_, res) => {
  const brands = await Product.distinct("brand");
  res.json(brands.sort());
};

const searchProducts = getProducts;

module.exports = {
  getProducts,
  searchProducts,
  getProductById,
  getBrands,
};
