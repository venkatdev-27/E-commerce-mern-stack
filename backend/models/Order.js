const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        image: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        orderName: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    shippingAddress: {
      type: Object,
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
    },

    hasReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔒 Collision-safe order number
orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model("Order", orderSchema);
