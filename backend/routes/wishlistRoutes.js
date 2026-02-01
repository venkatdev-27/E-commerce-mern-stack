const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// All wishlist routes must be protected
router.get("/", requireAuth, getWishlist);
router.post("/add", requireAuth, addToWishlist);
router.delete("/remove/:productId", requireAuth, removeFromWishlist);

module.exports = router;
