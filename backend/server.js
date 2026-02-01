const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5178",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",

  ],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
// User
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));

// Admin
app.use("/api/admin/auth", require("./admin/routes/adminAuthRoutes"));
app.use("/api/admin/products", require("./admin/routes/adminProductRoutes"));
app.use("/api/admin/categories", require("./admin/routes/adminCategoryRoutes"));
app.use("/api/admin/orders", require("./admin/routes/adminOrderRoutes"));
app.use("/api/admin/dashboard", require("./admin/routes/adminDashboardRoutes"));
app.use("/api/admin/support", require("./admin/routes/adminSupportRoutes"));
app.use("/api/admin/users", require("./admin/routes/adminUserRoutes"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
