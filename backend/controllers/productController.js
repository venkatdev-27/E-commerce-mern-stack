const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST,
} = require("../utils/dateUtils");


const normalizeCategory = (slug) =>
  slug
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\bmens\b/, "men's")
    .replace(/\bwomens\b/, "women's");

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
    if (search && search.trim()) {
      const tokens = search.trim().split(/\s+/);
      query.$and = tokens.map((token) => ({
        $or: [
          { name: new RegExp(token, "i") },
          { description: new RegExp(token, "i") },
          { category: new RegExp(token, "i") },
          { subCategory: new RegExp(token, "i") },
          { brand: new RegExp(token, "i") },
        ],
      }));
    }

    /* ---------- CATEGORY ---------- */
    if (category !== "all") {
      if (category === "recommended") {
        query.$or = [
          { rating: { $gte: 4 } },
          { discount: { $gte: 20 } },
        ];
      } else {
        // Try to find category by slug first, then fall back to name matching
        try {
          const categoryDoc = await Category.findOne({ 
            $or: [
              { slug: category.toLowerCase() },
              { slug: normalizeCategory(category) }
            ]
          });
          
          if (categoryDoc) {
            query.category = categoryDoc._id;
          } else {
            // Fallback to string matching if category not found
            const normalizedCategory = normalizeCategory(category);
            query.category = new RegExp(`^${normalizedCategory}$`, "i");
          }
        } catch (error) {
          console.error("Error finding category:", error);
          // Fallback to string matching
          const normalizedCategory = normalizeCategory(category);
          query.category = new RegExp(`^${normalizedCategory}$`, "i");
        }
      }
    }

    /* ---------- BRAND ---------- */
    if (brands && brands.trim()) {
      query.brand = { $in: brands.split(",").map(b => b.trim()) };
    }

    /* ---------- PRICE ---------- */
    const minPriceNum = Number(minPrice) || 0;
    const maxPriceNum = Number(maxPrice) || 100000;
    query.price = {
      $gte: minPriceNum,
      $lte: maxPriceNum,
    };

    /* ---------- SORT ---------- */
    let sortOptions = {};
    if (sortBy === "price-low-high") sortOptions.price = 1;
    else if (sortBy === "price-high-low") sortOptions.price = -1;
    else if (sortBy === "rating") sortOptions.rating = -1;
    else sortOptions = { isNewArrival: -1, discount: -1, rating: -1 };

    /* ---------- PAGINATION ---------- */
    const pageInt = Math.max(1, Number(page) || 1);
    const limitInt = Math.min(100, Math.max(1, Number(limit) || 50)); // Cap limit at 100
    const skip = (pageInt - 1) * limitInt;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitInt)
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products: convertArrayTimestampsToIST(products),
      total,
      page: pageInt,
      pages: Math.ceil(total / limitInt),
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🔍 REAL SEARCH (TEXT SEARCH – FAST)
===================================================== */
const searchProducts = async (req, res) => {
  try {
    const { q = "" } = req.query;

    if (!q.trim()) {
      return res.json({ products: [] });
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
      products: convertArrayTimestampsToIST(products),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Safely convert to plain object
    let productObj;
    try {
      productObj = product.toObject ? product.toObject() : product;
    } catch (conversionError) {
      console.error("Error converting product to object:", conversionError);
      productObj = product;
    }

    // Safely convert timestamps
    let convertedProduct;
    try {
      convertedProduct = convertTimestampsToIST(productObj);
    } catch (dateError) {
      console.error("Error converting timestamps:", dateError);
      // Return product without timestamp conversion if it fails
      convertedProduct = productObj;
    }

    res.json(convertedProduct);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   META FILTERS
===================================================== */
const getBrands = async (_, res) => {
  const brands = await Product.distinct("brand");
  res.json(brands.sort());
};

module.exports = {
  getProducts,
  searchProducts,
  getProductById,
  getBrands,
};
