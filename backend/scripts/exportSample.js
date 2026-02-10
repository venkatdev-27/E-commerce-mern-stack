require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  await mongoose.connect(MONGO_URI);
  
  const product = await Product.findOne({}).lean();
  
  const output = {
    name: product.name,
    image: product.image
  };
  
  fs.writeFileSync("product-sample.json", JSON.stringify(output, null, 2));
  console.log("✅ Sample saved to product-sample.json");
  
  process.exit();
})();
