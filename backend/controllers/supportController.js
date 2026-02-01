const SupportMessage = require("../models/SupportMessage");
const sgMail = require("@sendgrid/mail");

// Load API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Submit support message from frontend
const submitSupportMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create support message
    const supportMessage = new SupportMessage({
      name,
      email,
      subject,
      message,
      userId: req.user ? req.user._id : null, // Optional: link to authenticated user
    });

    await supportMessage.save();

    res.status(201).json({
      success: true,
      message: "Support message sent successfully",
      data: supportMessage,
    });
  } catch (error) {
    console.error("Error submitting support message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send support message",
    });
  }
};

// Get all support messages for admin
const getAllSupportMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "all"; // unread, read, replied, all

    let filter = {};
    if (status !== "all") {
      filter.status = status;
    }

    const totalMessages = await SupportMessage.countDocuments(filter);
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await SupportMessage.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch support messages",
    });
  }
};



// Update support message status
const updateSupportMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const message = await SupportMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Support message not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating support message status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
    });
  }
};

// Get support message statistics
const getSupportMessageStats = async (req, res) => {
  try {
    const stats = await SupportMessage.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsObj = {
      unread: 0,
      read: 0,
      replied: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      statsObj[stat._id] = stat.count;
      statsObj.total += stat.count;
    });

    res.json({
      success: true,
      data: statsObj,
    });
  } catch (error) {
    console.error("Error fetching support message stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch message statistics",
    });
  }
};

// Get user's support messages
const getUserSupportMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalMessages = await SupportMessage.countDocuments({ userId });
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await SupportMessage.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user support messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch support messages",
    });
  }
};

// Send reply to support message
const sendSupportReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    // Find the support message
    const message = await SupportMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Support message not found",
      });
    }

    // Send email via SendGrid
    const msg = {
      to: message.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Re: ${message.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">LuxeMarket Support Reply</h2>
          <p>Dear ${message.name},</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Original Message:</h3>
            <p><strong>Subject:</strong> ${message.subject}</p>
            <p><strong>Date:</strong> ${new Date(message.createdAt).toLocaleDateString()}</p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${message.message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Our Response:</h3>
            <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${replyText.replace(/\n/g, '<br>')}
            </div>
          </div>

          <p>If you have any further questions, please don't hesitate to contact us again.</p>

          <p>Best regards,<br>
          LuxeMarket Support Team<br>
          Email: luxemarekt008@gmail.com</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated response from LuxeMarket support system.
          </p>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log("✅ Support reply sent via SendGrid");

    // Update message status to replied
    await SupportMessage.findByIdAndUpdate(id, { status: 'replied' });

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Error sending support reply:", error);
    res.status(500).json({
      success: false,
      message: `Failed to send reply: ${error.message}`,
    });
  }
};

module.exports = {
  submitSupportMessage,
  getAllSupportMessages,
  updateSupportMessageStatus,
  getSupportMessageStats,
  getUserSupportMessages,
  sendSupportReply,
};
