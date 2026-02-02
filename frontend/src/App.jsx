import React from "react";
import {

  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";
import HomePage from "@/features/products/HomePage.jsx";
import ShopPage from "@/features/products/ShopPage.jsx";
import ProductDetailsPage from "@/features/products/ProductDetailsPage.jsx";
import CartPage from "@/features/cart/CartPage.jsx";
import WishlistPage from "@/features/cart/WishlistPage.jsx";
import LoginPage from "@/features/auth/LoginPage.jsx";
import SignupPage from "@/features/auth/SignupPage.jsx";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage.jsx";
import CheckoutPage from "@/features/orders/CheckoutPage.jsx";
import OrderTrackingPage from "@/features/orders/OrderTrackingPage.jsx";
import MyOrdersPage from "@/features/orders/MyOrdersPage.jsx";
import PrivacyPolicyPage from "@/features/support/PrivacyPolicyPage.jsx";
import SupportPage from "@/features/support/SupportPage.jsx";
import MenClothes from "@/pages/MenClothes.jsx";
import WomenClothes from "@/pages/WomenClothes.jsx";
import Electronics from "@/pages/Electronics.jsx";
import Footwear from "@/pages/Footwear.jsx";
import Home from "@/pages/Home.jsx";
import Beauty from "@/pages/Beauty.jsx";
import Sports from "@/pages/Sports.jsx";
import Accessories from "@/pages/Accessories.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";


// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <>
      <ScrollToTop />

      <div className="min-h-screen flex flex-col bg-gray-50 text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/men" element={<MenClothes />} />
            <Route path="/women" element={<WomenClothes />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/footwear" element={<Footwear />} />
            <Route path="/home" element={<Home />} />
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </main>
        <footer className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-slate-800 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl translate-y-1/2"></div>

          <div className="relative z-10 py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              {/* Main footer content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                {/* Brand section */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-1 mb-6">
                    <div className="relative">
                      <span className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text tracking-tight font-display">
                        L
                      </span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-slate-800 mx-1">
                      &
                    </span>
                    <div className="relative">
                      <span className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text tracking-tight font-display">
                        M
                      </span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                    Premium e-commerce destination for fashion, electronics,
                    and home living. Discover quality products with
                    exceptional service.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/luxemarket",
                          "_blank",
                        )
                      }
                      className="w-10 h-10 bg-slate-200/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-300/50 transition-colors cursor-pointer group"
                      aria-label="Follow us on Facebook"
                    >
                      <svg
                        className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/luxemarket",
                          "_blank",
                        )
                      }
                      className="w-10 h-10 bg-slate-200/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-300/50 transition-colors cursor-pointer group"
                      aria-label="Follow us on Instagram"
                    >
                      <svg
                        className="w-5 h-5 text-slate-700 group-hover:text-pink-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          "mailto:luxemarket008@gmail.com",
                          "_blank",
                        )
                      }
                      className="w-10 h-10 bg-slate-200/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-300/50 transition-colors cursor-pointer group"
                      aria-label="Email us"
                    >
                      <svg
                        className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open("https://github.com/luxemarket", "_blank")
                      }
                      className="w-10 h-10 bg-slate-200/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-300/50 transition-colors cursor-pointer group"
                      aria-label="Follow us on GitHub"
                    >
                      <svg
                        className="w-5 h-5 text-slate-700 group-hover:text-gray-900 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Shop section */}
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-6 relative">
                    Shop
                    <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/shop?category=men-clothes"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Men's Fashion
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=women-clothes"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Women's Fashion
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=electronics"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Electronics
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=home"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Home & Living
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?category=footwear"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Footwear
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support section */}
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-6 relative">
                    Support
                    <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/support"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Track Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/privacy"
                        className="text-slate-600 hover:text-slate-800 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Payment section */}
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-6 relative">
                    Secure Payment
                    <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">
                    We accept all major payment methods
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="bg-slate-200/50 backdrop-blur-md rounded-lg p-2 hover:bg-slate-300/50 transition-colors">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                        alt="Mastercard"
                        className="h-6"
                      />
                    </div>
                    <div className="bg-slate-200/50 backdrop-blur-md rounded-lg p-2 hover:bg-slate-300/50 transition-colors">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                        alt="Visa"
                        className="h-6"
                      />
                    </div>
                    <div className="bg-slate-200/50 backdrop-blur-md rounded-lg p-2 hover:bg-slate-300/50 transition-colors">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                        alt="GPay"
                        className="h-6"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Secure & Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Bottom section */}
              <div className="border-t border-slate-200/50 pt-4 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-slate-500 text-sm text-center md:text-left">
                    © {new Date().getFullYear()} LuxeMarket. All rights
                    reserved.
                    <span className="hidden md:inline"> | </span>
                    <br className="md:hidden" />
                    <span className="text-xs text-slate-400">
                      Made with ❤️ for premium shopping
                    </span>
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
