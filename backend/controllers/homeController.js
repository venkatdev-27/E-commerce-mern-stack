const Product = require("../models/Product");

/* =========================
   IN-MEMORY CACHE
========================= */
let homePageCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * @desc    Get all Home Page data in a single optimized request
 * @route   GET /api/home
 * @access  Public
 */
exports.getHomePageData = async (req, res) => {
  try {
    const now = Date.now();

    /* =========================
       SERVE FROM CACHE
    ========================= */
    if (homePageCache && now - lastCacheTime < CACHE_TTL) {
      return res.status(200).json({
        success: true,
        data: homePageCache,
        source: "cache",
      });
    }

    const start = Date.now();

    /* =========================
       PROJECTION (HOME PAGE ONLY)
    ========================= */
    const projection =
      "_id name price image rating discount category brand";

    /* =========================
       QUERY HELPER
    ========================= */
    const getSection = (query, sort = {}) =>
      Product.find(query)
        .select(projection)
        .sort(sort)
        .limit(10)
        .lean();

    /* =========================
       PARALLEL QUERIES
    ========================= */
    const [
      flashSale,
      bestSellers,
      electronics,
      mensFashion,
      womensFashion,
      justForYou,
    ] = await Promise.all([
      // Flash Sale
      getSection({ isFlashSale: true }),

      // Best Sellers
      getSection({ isBestSeller: true }),

      // Electronics
      getSection({ category: { $regex: "electronics", $options: "i" } }),

      // Men's Fashion (premium → price desc)
      getSection({ category: { $regex: "men", $options: "i" } }, { price: -1 }),

      // Women's Fashion (trending → newest)
      getSection({ category: { $regex: "women", $options: "i" } }, { createdAt: -1 }),

      // Just For You (latest products)
      getSection({}, { createdAt: -1 }),
    ]);

    /* =========================
       RESPONSE OBJECT
    ========================= */
    const responseData = {
      flashSale,
      bestSellers,
      electronics,
      mensFashion,
      womensFashion,
      justForYou,
      generatedAt: new Date().toISOString(),
    };

    /* =========================
       UPDATE CACHE
    ========================= */
    homePageCache = JSON.parse(JSON.stringify(responseData));
    lastCacheTime = now;

    const duration = Date.now() - start;
    console.log(`🚀 Home page data fetched in ${duration}ms`);

    return res.status(200).json({
      success: true,
      data: responseData,
      duration,
    });
  } catch (error) {
    console.error("❌ Home Page Data Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load home page data",
    });
  }
};
