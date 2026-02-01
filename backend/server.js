const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* =========================
   ✅ CORS (PRODUCTION READY)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://luxemarket-ljoh.onrender.com",
  "https://e-commerce-mern-stack-i66g.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔍 Request Origin:", origin);
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      console.log("✅ No origin - allowing request");
      return callback(null, true);
    }
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      return callback(null, true);
    }
    
    console.log("❌ Origin blocked:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Length", "X-Total-Count"],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================
   BODY PARSER
========================= */
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
   USER ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));

/* =========================
   ADMIN ROUTES
========================= */
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
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
