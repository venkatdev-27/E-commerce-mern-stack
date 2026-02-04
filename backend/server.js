const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* =========================
   CORS
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://luxemarket-ljoh.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // allow all in prod
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());

/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES (REGISTER AFTER DB)
========================= */
const startServer = async () => {
  try {
    await connectDB(); // ✅ WAIT HERE

    /* USER ROUTES */
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/categories", require("./routes/categoryRoutes"));
    app.use("/api/wishlist", require("./routes/wishlistRoutes"));
    app.use("/api/orders", require("./routes/orderRoutes"));
    app.use("/api/support", require("./routes/supportRoutes"));
    app.use("/api/home", require("./routes/homeRoutes"));

    /* ADMIN ROUTES */
    app.use("/api/admin/auth", require("./admin/routes/adminAuthRoutes"));
    app.use("/api/admin/products", require("./admin/routes/adminProductRoutes"));
    app.use("/api/admin/categories", require("./admin/routes/adminCategoryRoutes"));
    app.use("/api/admin/orders", require("./admin/routes/adminOrderRoutes"));
    app.use("/api/admin/dashboard", require("./admin/routes/adminDashboardRoutes"));
    app.use("/api/admin/support", require("./admin/routes/adminSupportRoutes"));
    app.use("/api/admin/users", require("./admin/routes/adminUserRoutes"));

    /* HEALTH CHECK */
    app.get("/", (req, res) => {
      res.send("API is running 🚀");
    });

    /* ERROR HANDLER */
    app.use((err, req, res, next) => {
      console.error("🔥 Error:", err.message);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
