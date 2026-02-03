const express = require("express");
const router = express.Router();
const { getHomePageData } = require("../controllers/homeController");

/**
 * @route   GET /api/home
 * @desc    Fetch optimized Home Page data
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    await getHomePageData(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/home/ping
 * @desc    Health check for Home route
 * @access  Public
 */
router.get("/ping", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Home route is working",
  });
});

module.exports = router;
