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

    /* ---------- SEARCH (ONLY STRING FIELDS) ---------- */
    if (search && search.trim()) {
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

    /* ---------- CATEGORY (SLUG → ObjectId) ---------- */
    if (category !== "all" && category !== "recommended") {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase(),
      }).select("_id");

      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    /* ---------- RECOMMENDED ---------- */
    if (category === "recommended") {
      query.$or = [
        { rating: { $gte: 4 } },
        { discount: { $gte: 20 } },
      ];
    }

    /* ---------- BRAND ---------- */
    if (brands && brands.trim()) {
      query.brand = { $in: brands.split(",").map((b) => b.trim()) };
    }

    /* ---------- PRICE ---------- */
    query.price = {
      $gte: Number(minPrice) || 0,
      $lte: Number(maxPrice) || 100000,
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
      .sort(sortOptions)
      .skip(skip)
      .limit(limitInt)
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
   🔍 TEXT SEARCH (AUTOCOMPLETE / FAST SEARCH)
===================================================== */
const searchProducts = async (req, res) => {
  try {
    const { q = "" } = req.query;

    if (!q.trim()) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .select("name image category price brand")
      .lean();

    res.json({
      success: true,
      products: convertArrayTimestampsToIST(products),
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ success: false, message: "Search failed" });
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

    const product = await Product.findById(id).lean();
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

/* =====================================================
   EXPORTS ✅ (THIS IS WHAT YOU ASKED)
===================================================== */
module.exports = {
  getProducts,
  searchProducts,
  getProductById,
  getBrands,
};
