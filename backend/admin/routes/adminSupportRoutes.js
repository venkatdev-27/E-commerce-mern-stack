const express = require("express");
const {
  getAllSupportMessages,
  updateSupportMessageStatus,
  getSupportMessageStats,
  sendSupportReply,
} = require("../../controllers/supportController");
const requireAdminAuth = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// All admin routes require authentication
router.use(requireAdminAuth);

// Get all support messages with pagination and filtering
router.get("/", getAllSupportMessages);

// Get support message statistics
router.get("/stats", getSupportMessageStats);

// Update support message status
router.patch("/:id/status", updateSupportMessageStatus);

// Send reply to support message
router.post("/:id/reply", sendSupportReply);

module.exports = router;
