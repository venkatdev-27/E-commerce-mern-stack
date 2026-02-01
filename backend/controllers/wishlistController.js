const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { convertArrayTimestampsToIST } = require("../utils/dateUtils");

/* =========================
   GET WISHLIST
========================= */
const getWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate("products");

    // Convert UTC timestamps to IST for products
    const productsWithIST = wishlist ? convertArrayTimestampsToIST(wishlist.products) : [];

    res.json({
      products: productsWithIST,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADD TO WISHLIST
========================= */
const addToWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    await wishlist.populate("products");

    // Convert UTC timestamps to IST for products
    const productsWithIST = convertArrayTimestampsToIST(wishlist.products);

    res.json({
      message: "Added to wishlist",
      products: productsWithIST,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REMOVE FROM WISHLIST
========================= */
const removeFromWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    // Convert UTC timestamps to IST for products
    const productsWithIST = convertArrayTimestampsToIST(wishlist.products);

    res.json({
      message: "Removed from wishlist",
      products: productsWithIST,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
