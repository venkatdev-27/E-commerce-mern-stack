const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    sizes: [String],

    image: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },

    isFlashSale: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES (OPTIMIZED)
========================= */

// Home page & listing performance
productSchema.index({ isFlashSale: 1 });
productSchema.index({ isBestSeller: 1 });

// Category browsing + sorting
productSchema.index({ category: 1, price: -1 });

// Brand filtering
productSchema.index({ brand: 1 });

/* =========================
   TEXT SEARCH (ONLY ONE)
========================= */
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
  subCategory: "text",
});

module.exports = mongoose.model("Product", productSchema);
