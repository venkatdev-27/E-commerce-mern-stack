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
   CHECK IMAGE URLS
======================= */
const checkImageURLs = async () => {
  const products = await Product.find({}).limit(5);
  
  console.log("📷 Checking first 5 product image URLs:\n");
  console.log("═══════════════════════════════════════════════════════════");
  
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    
    if (product.image && typeof product.image === 'object') {
      console.log(`   URL: ${product.image.url}`);
      console.log(`   Public ID: ${product.image.public_id || 'N/A'}`);
      
      // Check if URL is from Cloudinary
      if (product.image.url && product.image.url.includes('cloudinary.com')) {
        console.log(`   Status: ✅ Hosted on Cloudinary`);
      } else if (product.image.url && product.image.url.startsWith('http')) {
        console.log(`   Status: ⚠️  External URL (not Cloudinary)`);
      } else if (product.image.url && product.image.url.startsWith('/')) {
        console.log(`   Status: ❌ Local path (not uploaded to Cloudinary)`);
      } else {
        console.log(`   Status: ❓ Unknown format`);
      }
    } else {
      console.log(`   Status: ❌ No image object`);
    }
    console.log("───────────────────────────────────────────────────────────");
  });
};

/* =======================
   RUN
======================= */
(async () => {
  try {
    await connectDB();
    await checkImageURLs();
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit();
  }
})();
