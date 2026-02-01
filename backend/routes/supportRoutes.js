const express = require("express");
const {
  submitSupportMessage,
  getUserSupportMessages,
} = require("../controllers/supportController");

const requireAuth = require("../middleware/auth");

const router = express.Router();

// Submit support message (frontend)
router.post("/submit", requireAuth, submitSupportMessage);

// Get user's support messages
router.get("/my-messages", requireAuth, getUserSupportMessages);

module.exports = router;
