const mongoose = require("mongoose");
const Category = require("./models/Category");

// Test script to check database connection and category data
async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Use the same connection settings as in db.js
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferMaxEntries', 0);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverDiscoveryAndMonitoringTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB");

    // Test category queries with the exact slugs provided by the user
    const testSlugs = ["electronics", "mens-fashion", "womens-fashion", "footwear", "home-living", "beauty-care", "sports", "accessories"];
    
    console.log("🔍 Testing category queries...");
    
    for (const slug of testSlugs) {
      try {
        const category = await Category.findOne({ slug: slug.toLowerCase() });
        if (category) {
          console.log(`✅ Found category: ${slug} -> ID: ${category._id}`);
        } else {
          console.log(`❌ Category not found: ${slug}`);
        }
      } catch (error) {
        console.error(`❌ Error querying category ${slug}:`, error.message);
      }
    }

    // Test a simple product query
    console.log("🔍 Testing product queries...");
    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    console.log(`📦 Total products in database: ${productCount}`);

    if (productCount > 0) {
      const sampleProduct = await mongoose.connection.db.collection('products').findOne();
      console.log("📦 Sample product:", {
        name: sampleProduct?.name,
        category: sampleProduct?.category,
        price: sampleProduct?.price
      });
    }

  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the test
testConnection();