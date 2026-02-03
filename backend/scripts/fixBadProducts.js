require("dotenv").config(); // Load .env from CWD (backend/)
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category"); // ✅ REQUIRED for queries

const fixBadData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find products where category is a string (and not an ObjectId)
    // In Mongo, ObjectIds are generally stored as BSON ObjectId type.
    // If it's stored as a string "Men's Fashion", it will match type string.
    
    // We can also fetch ALL products and check manually to be sure.
    const products = await Product.find({}, { name: 1, category: 1 }).lean();

    console.log(`🔍 Checking ${products.length} products...`);

    let fixedCount = 0;
    let badCount = 0;
    
    for (const p of products) {
      if (p.category && !mongoose.Types.ObjectId.isValid(p.category)) {
        console.log(`❌ Invalid Category in Product: ${p._id} (${p.name})`);
        console.log(`   Value: "${p.category}"`);

        // Attempt to find the category by Name (slug-ish)
        const cat = await mongoose.model("Category").findOne({ 
            $or: [{ name: p.category }, { slug: p.category.toLowerCase().replace(/ /g, '-') }] 
        });

        if (cat) {
            console.log(`   ✅ Found matching Category: ${cat.name} (${cat._id})`);
            await Product.updateOne({ _id: p._id }, { category: cat._id });
            console.log(`   ✨ Updated Product with valid ID.`);
            fixedCount++;
        } else {
            console.log(`   ⚠️ No matching Category found. Removing category field.`);
            await Product.updateOne({ _id: p._id }, { $unset: { category: "" } });
            fixedCount++;
        }
        badCount++;
      }
    }

    console.log(`\n🎉 Scan Complete.`);
    console.log(`Found ${badCount} invalid records.`);
    console.log(`Fixed ${fixedCount} records.`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixBadData();
