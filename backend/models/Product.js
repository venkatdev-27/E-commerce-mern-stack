const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },

    // MUST STORE CATEGORY SLUG
category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
},


    subCategory: { type: String, trim: true },
    brand: { type: String, trim: true },
    color: { type: String, trim: true },
    sizes: [String],

    image: { type: String, required: true },

    rating: { type: Number, default: 4, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 90 },

    isFlashSale: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },

    stock: { type: Number, default: 0, min: 0 },

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, price: -1 });
productSchema.index({ brand: 1 });
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
  subCategory: "text",
});

module.exports = mongoose.model("Product", productSchema);
