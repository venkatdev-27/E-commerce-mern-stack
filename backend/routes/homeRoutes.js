const express = require("express");
const router = express.Router();
const { getHomePageData } = require("../controllers/homeController");

/**
 * @route   GET /api/home
 * @desc    Fetch optimized Home Page data
 * @access  Public
 */
router.get("/", getHomePageData);

/**
 * @route   GET /api/home/ping
 * @desc    Health check for Home route
 * @access  Public
 */
router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Home route is working" });
});

module.exports = router;
