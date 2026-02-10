require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI;

/* =======================
   CONNECT DB
======================= */
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected\n");
};

/* =======================
   CHECK PRODUCTS
======================= */
const checkProducts = async () => {
  const allProducts = await Product.find({});
  
  console.log(`📦 Total Products in Database: ${allProducts.length}\n`);
  
  if (allProducts.length === 0) {
    console.log("⚠️  No products found in database!");
    return;
  }

  let objectFormat = 0;
  let stringFormat = 0;
  let noImage = 0;

  console.log("═══════════════════════════════════════════════════════════");
  allProducts.forEach((product, index) => {
    const imageType = typeof product.image;
    
    if (!product.image) {
      noImage++;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ❌ No image`);
    } else if (imageType === 'object') {
      objectFormat++;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ✅ Object format`);
      console.log(`   URL: ${product.image.url || 'N/A'}`);
      console.log(`   Public ID: ${product.image.public_id || 'N/A'}`);
    } else if (imageType === 'string') {
      stringFormat++;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ⚠️  String format (needs migration)`);
      console.log(`   Path: ${product.image}`);
    }
    console.log("───────────────────────────────────────────────────────────");
  });

  console.log("\n📊 SUMMARY:");
  console.log(`   ✅ Migrated (object format): ${objectFormat}`);
  console.log(`   ⚠️  Needs migration (string format): ${stringFormat}`);
  console.log(`   ❌ No image: ${noImage}`);
};

/* =======================
   RUN
======================= */
(async () => {
  try {
    await connectDB();
    await checkProducts();
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit();
  }
})();
