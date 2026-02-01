const Product = require("../../models/Product");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Category = require("../../models/Category");

const getDashboardStats = async (req, res) => {
  try {
    const { status } = req.query;
    
    /* =========================
       BASIC COUNTS
    ========================= */
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Category.countDocuments()
    ]);

    /* =========================
       REVENUE STATS
    ========================= */
    // Total Revenue from COD, CARD, UPI payments (only delivered orders)
    const totalRevenueStats = await Order.aggregate([
      {
        $match: {
          paymentMethod: { $in: ["COD", "CARD", "UPI"] },
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Completed orders count (delivered/shipped)
    const completedOrdersStats = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Delivered", "Shipped"] }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = totalRevenueStats[0]?.totalRevenue || 0;
    const completedOrders = completedOrdersStats[0]?.count || 0;

    /* =========================
       RECENT ORDERS
    ========================= */
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    /* =========================
       ORDER STATUS DISTRIBUTION
    ========================= */
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    /* =========================
       REVENUE CHARTS DATA
    ========================= */
    // Daily revenue (last 7 days) - only delivered orders
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentMethod: { $in: ["COD", "CARD", "UPI"] },
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    // Monthly revenue (last 12 months) - only delivered orders
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          paymentMethod: { $in: ["COD", "CARD", "UPI"] },
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Weekly revenue (last 4 weeks) - only delivered orders
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fourWeeksAgo },
          paymentMethod: { $in: ["COD", "CARD", "UPI"] },
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.week": 1
        }
      }
    ]);

    // Half-yearly revenue (last 2 years) - only delivered orders
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const halfYearlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twoYearsAgo },
          paymentMethod: { $in: ["COD", "CARD", "UPI"] },
          status: "Delivered"
        }
      },
      {
        $addFields: {
          halfYear: {
            $cond: {
              if: { $lte: [{ $month: "$createdAt" }, 6] },
              then: "H1",
              else: "H2"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            halfYear: "$halfYear"
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.halfYear": 1
        }
      }
    ]);

    /* =========================
       TOP SELLING PRODUCTS (FILTERED BY STATUS)
    ========================= */
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: status || "Delivered"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          image: "$product.image",
          category: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
          totalSold: 1,
          totalRevenue: 1
        }
      },
      {
        $addFields: {
          category: {
            $switch: {
              branches: [
                { case: { $eq: ["$category", "Men's Fashion"] }, then: "Men's Fashion" },
                { case: { $eq: ["$category", "Mens Fashion"] }, then: "Men's Fashion" },
                { case: { $eq: ["$category", "Women's Fashion"] }, then: "Women's Fashion" },
                { case: { $eq: ["$category", "Womens Fashion"] }, then: "Women's Fashion" },
                { case: { $eq: ["$category", "Home & Living"] }, then: "Home & Living" },
                { case: { $eq: ["$category", "Home and Living"] }, then: "Home & Living" },
                { case: { $eq: ["$category", "Beauty & Care"] }, then: "Beauty & Care" },
                { case: { $eq: ["$category", "Beauty and Care"] }, then: "Beauty & Care" },
                { case: { $eq: ["$category", "Sports & Fitness"] }, then: "Sports & Fitness" },
                { case: { $eq: ["$category", "Sports and Fitness"] }, then: "Sports & Fitness" }
              ],
              default: "$category"
            }
          }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 } // Increased limit to get more products for better category distribution
    ]);

    /* =========================
       PAYMENT METHOD BREAKDOWN (DELIVERED ORDERS ONLY)
    ========================= */
    const paymentMethodStats = await Order.aggregate([
      {
        $match: {
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: "$paymentMethod",
          totalAmount: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        totalRevenue,
        completedOrders,
        paymentMethods: paymentMethodStats
      },
      recentOrders,
      orderStatusStats,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      halfYearlyRevenue,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
