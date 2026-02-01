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
      index: true, // ✅ sorting & filtering
    },

    category: {
      type: String,
      required: true,
      index: true, // ✅ filtering
    },

    subCategory: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      index: true, // ✅ filtering
    },

    color: {
      type: String,
      trim: true,
    },

    sizes: {
      type: [String],
    },

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

    isNewArrival: {
      type: Boolean,
      default: false,
      index: true, // ✅ homepage filters
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    specifications: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   🔥 TEXT INDEX FOR REAL SEARCH (ONLY ONE)
===================================================== */
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
  subCategory: "text",
});

module.exports = mongoose.model("Product", productSchema);
