const Product = require("../models/Product");
const Category = require("../models/Category");

/* =========================
   IN-MEMORY CACHE
========================= */
let homePageCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

/**
 * @route   GET /api/home
 * @access  Public
 */
exports.getHomePageData = async (req, res) => {
  try {
    console.log("✅ /api/home called");

    const now = Date.now();

    // Serve cache
    if (homePageCache && now - lastCacheTime < CACHE_TTL) {
      return res.status(200).json({
        success: true,
        data: homePageCache,
        source: "cache",
      });
    }

    const projection =
      "_id name price image rating reviews discount category brand createdAt";

    // Helper: get category id
    const getCategoryId = async (slug) => {
      const cat = await Category.findOne({ slug }).select("_id").lean();
      return cat?._id;
    };

    // Helper: fetch products
    const getSection = async (query, sort = {}) => {
      return Product.find(query)
        .select(projection)
        .sort(sort)
        .limit(10)
        .lean();
    };

    // Category IDs
    const electronicsId = await getCategoryId("electronics");
    const mensFashionId = await getCategoryId("mens-fashion");
    const womensFashionId = await getCategoryId("womens-fashion");

    console.log("📦 Categories:", {
      electronicsId,
      mensFashionId,
      womensFashionId,
    });

    // Fetch data
    const [
      flashSale,
      bestSellers,
      electronics,
      mensFashion,
      womensFashion,
      justForYou,
    ] = await Promise.all([
      getSection({ isFlashSale: true }),
      getSection({ isBestSeller: true }),
      electronicsId ? getSection({ category: electronicsId }) : [],
      mensFashionId
        ? getSection({ category: mensFashionId }, { price: -1 })
        : [],
      womensFashionId
        ? getSection({ category: womensFashionId }, { createdAt: -1 })
        : [],
      getSection({}, { createdAt: -1 }),
    ]);

    const responseData = {
      flashSale,
      bestSellers,
      electronics,
      mensFashion,
      womensFashion,
      justForYou,
      generatedAt: new Date().toISOString(),
    };

    homePageCache = responseData;
    lastCacheTime = now;

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ HOME PAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load home page data",
    });
  }
};
