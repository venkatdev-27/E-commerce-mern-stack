const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { convertArrayTimestampsToIST, convertTimestampsToIST } = require("../utils/dateUtils");

/* =========================
   PLACE ORDER
========================= */
const placeOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

    console.log('Order request:', { items: items?.length, totalAmount, paymentMethod, shippingAddress, type: typeof totalAmount });

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    
    let parsedTotalAmount;
    if (typeof totalAmount === 'string') {
      parsedTotalAmount = parseFloat(totalAmount);
    } else if (typeof totalAmount === 'number') {
      parsedTotalAmount = totalAmount;
    } else {
      return res.status(400).json({
        message: "Invalid total amount type",
        received: totalAmount,
        type: typeof totalAmount
      });
    }

    if (isNaN(parsedTotalAmount) || parsedTotalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid total amount value",
        received: totalAmount,
        parsed: parsedTotalAmount,
        type: typeof totalAmount
      });
    }

    const orderItems = [];

    for (const item of items) {
      if (!item) continue;
  const productId = item.product || item.productId || item._id;

  const quantity = parseInt(item.quantity);
  if (!productId || isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid cart item" });
  }

  // Handle both ObjectId and string id (from seed data)
  let product;
  if (mongoose.Types.ObjectId.isValid(productId)) {
    product = await Product.findById(productId);
  } else {
    product = await Product.findOne({ id: productId });
  }

  if (!product) {
    return res.status(404).json({ message: `Product not found: ${productId}` });
  }

  const discount = product.discount || 0;
  const price =
    discount > 0
      ? product.price - (product.price * discount) / 100
      : product.price;

  orderItems.push({
    product: product._id,
    title: product.name,
    image: product.image?.url,
    quantity: item.quantity,
    price,
    orderName: product.name,
    category: product.category,
  });
}

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: parsedTotalAmount,
      paymentMethod: paymentMethod || "COD",
      shippingAddress,
    });

    await order.save();

    // Convert UTC timestamps to IST
    const orderWithIST = convertTimestampsToIST(order.toObject());

    res.status(201).json({
      message: "Order placed successfully",
      order: orderWithIST,
    });
  } catch (error) {
    console.error("Place order error:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* =========================
   GET USER ORDERS
========================= */
const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    // Convert UTC timestamps to IST
    const ordersWithIST = convertArrayTimestampsToIST(orders);

    res.json({ orders: ordersWithIST });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET SINGLE ORDER (TRACKING)
========================= */
const getOrderById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Convert UTC timestamps to IST
    const orderWithIST = convertTimestampsToIST(order.toObject());

    res.json({ order: orderWithIST });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   SUBMIT REVIEW FOR ORDER
========================= */
const submitReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orderId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid rating (1-5) is required" });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      status: "Delivered"
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or not eligible for review" });
    }

    if (order.hasReviewed) {
      return res.status(400).json({ message: "Review already submitted for this order" });
    }

    // Update the order to mark as reviewed
    order.hasReviewed = true;
    await order.save();

    // Here you could also save the rating to a separate reviews collection
    // For now, we'll just mark the order as reviewed

    res.json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
  submitReview,
};
