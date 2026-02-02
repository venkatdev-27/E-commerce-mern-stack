const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedFlags = async () => {
  try {
    await connectDB();

    console.log("⏳ seeding home page flags...");

    // Reset all flags first
    await Product.updateMany({}, { 
      $set: { isFlashSale: false, isBestSeller: false } 
    });

    const products = await Product.find({}, '_id');

    if (products.length === 0) {
      console.log("No products found to update.");
      process.exit();
    }

    // Mark 10 random products as Flash Sale
    const shuffled = products.sort(() => 0.5 - Math.random());
    const flashSaleIds = shuffled.slice(0, 10).map(p => p._id);
    const bestSellerIds = shuffled.slice(10, 20).map(p => p._id);

    await Product.updateMany(
      { _id: { $in: flashSaleIds } },
      { $set: { isFlashSale: true } }
    );

    await Product.updateMany(
      { _id: { $in: bestSellerIds } },
      { $set: { isBestSeller: true } }
    );

    console.log("✅ Successfully updated products with isFlashSale and isBestSeller flags");
    console.log(`Flash Sale: ${flashSaleIds.length} items`);
    console.log(`Best Sellers: ${bestSellerIds.length} items`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedFlags();
