const mongoose = require("mongoose");
const Order = require("../../models/Order");
const {
  convertArrayTimestampsToIST,
  convertTimestampsToIST
} = require("../../utils/dateUtils");

/* ================================
   GET ALL ORDERS (ADMIN)
================================ */
const getAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 10, status = "", search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    let query = {};

    if (status) {
      query.status = status;
    }

    // 🔍 Search handling
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      }
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(query);

    const ordersWithIST = convertArrayTimestampsToIST(orders);

    res.json({
      orders: ordersWithIST,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET SINGLE ORDER
================================ */
const getOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "items.product",
        select: "name category brand"
      })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderWithIST = convertTimestampsToIST(order);
    res.json(orderWithIST);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE ORDER STATUS
================================ */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderWithIST = convertTimestampsToIST(order);
    res.json(orderWithIST);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   ORDER STATISTICS
================================ */
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      {
        $match: { status: { $in: ["delivered", "shipped"] } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      stats,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};
