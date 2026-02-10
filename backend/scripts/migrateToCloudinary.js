require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI;
const BASE_DIR = path.join(__dirname, ".."); // project root

/* =======================
   CONNECT DB
======================= */
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
};

/* =======================
   MIGRATE PRODUCTS
======================= */
const migrateProducts = async () => {
  const products = await Product.find({});

  console.log(`📦 Total products found: ${products.length}`);

  let migrated = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      // Skip if image is already an object (already migrated)
      if (typeof product.image === 'object' && product.image !== null) {
        console.log(`⏭ Skipped (already migrated): ${product.name}`);
        skipped++;
        continue;
      }

      // Skip if no image or not a local path
      if (!product.image || typeof product.image !== 'string' || !product.image.startsWith("/uploads")) {
        console.log(`⏭ Skipped (no local image): ${product.name}`);
        skipped++;
        continue;
      }

      const localPath = path.join(BASE_DIR, product.image);
      console.log(`⬆ Uploading product: ${product.name}`);

      const upload = await cloudinary.uploader.upload(localPath, {
        folder: "luxemarket/products"
      });

      product.image = {
        url: upload.secure_url,
        public_id: upload.public_id
      };

      await product.save();
      console.log(`✅ Migrated: ${product.name}`);
      migrated++;
    } catch (err) {
      console.error(`❌ Product failed: ${product.name}`, err.message);
    }
  }

  console.log(`\n📊 Products Summary: ${migrated} migrated, ${skipped} skipped`);
};

/* =======================
   MIGRATE CATEGORIES
======================= */
const migrateCategories = async () => {
  const categories = await Category.find({});

  console.log(`📂 Total categories found: ${categories.length}`);

  let migrated = 0;
  let skipped = 0;

  for (const category of categories) {
    try {
      // Skip if image is already an object (already migrated)
      if (typeof category.image === 'object' && category.image !== null) {
        console.log(`⏭ Skipped (already migrated): ${category.name}`);
        skipped++;
        continue;
      }

      // Skip if no image or not a local path
      if (!category.image || typeof category.image !== 'string' || !category.image.startsWith("/uploads")) {
        console.log(`⏭ Skipped (no local image): ${category.name}`);
        skipped++;
        continue;
      }

      const localPath = path.join(BASE_DIR, category.image);
      console.log(`⬆ Uploading category: ${category.name}`);

      const upload = await cloudinary.uploader.upload(localPath, {
        folder: "luxemarket/categories"
      });

      category.image = {
        url: upload.secure_url,
        public_id: upload.public_id
      };

      await category.save();
      console.log(`✅ Migrated: ${category.name}`);
      migrated++;
    } catch (err) {
      console.error(`❌ Category failed: ${category.name}`, err.message);
    }
  }

  console.log(`\n📊 Categories Summary: ${migrated} migrated, ${skipped} skipped`);
};

/* =======================
   RUN
======================= */
(async () => {
  await connectDB();
  await migrateProducts();
  await migrateCategories();
  console.log("🎉 Migration completed");
  process.exit();
})();
