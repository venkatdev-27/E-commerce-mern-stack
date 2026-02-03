import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  LayoutGrid,
  ArrowLeft,
  Package,
  User,
  ChevronRight,
  Star,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Dumbbell,
  Watch,
  Image as ImageIcon,
} from "lucide-react";



import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useToast } from "@/context/ToastContext";
import { getProducts, getCategories } from "@/api";
import { getImageUrl } from "@/utils/imageUtils";

const Navbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* 🔍 REAL SEARCH STATES */
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const cartItemsCount = useAppSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Load products for search suggestions (using search API)
  /* =====================================================
   LOAD CATEGORIES (HARD CODED)
===================================================== */



  // 🔹 Utility: safe category slug generator
  const makeSlug = (name) =>
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const categoriesFromDB = res.categories || res || [];

        const dbCategories = categoriesFromDB.map((cat) => ({
          id: cat._id, // real DB id
          name: cat.name,
          slug: cat.slug?.trim() || makeSlug(cat.name),

          image: cat.image || null,
        }));

        // ✅ ADD STATIC FIRST
        setCategories([
          {
            id: "all",
            name: "All Products",
            slug: "all",
            image: null,
          },
          {
            id: "recommended",
            name: "Recommended",
            slug: "recommended",
            image: null,
          },
          ...dbCategories,
        ]);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  /* =====================================================
   🔍 REAL SEARCH (BACKEND + DEBOUNCE)
===================================================== */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await getProducts({ search: searchTerm, limit: 10 });
        setSuggestions(res.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);



  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setSearchTerm("");
      setShowSuggestions(false);
    }
  }, [location.pathname]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    navigate(`/shop?search=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
    setIsMobileSearchOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    addToast("Logged out successfully", "info");
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleGoBack = () => {
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  };

  /* =====================================================
     CATEGORY ICON HELPER
  ===================================================== */
  const getCategoryIcon = (category) => {
    // 1️⃣ DB image (MAIN CASE)
    if (category.image) {
      return (
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="
          w-8 h-8 rounded-full object-cover
          md:border md:border-gray-300   /* Laptop only */
        "
        />
      );
    }

    // 2️⃣ Static icons
    if (category.id === "all") {
      return (
        <LayoutGrid
          size={20}
          className="text-gray-600"
        />
      );
    }

    if (category.id === "recommended") {
      return (
        <Star
          size={20}
          className="text-yellow-500"
        />
      );
    }

    // 3️⃣ Improved placeholder (VISIBLE & CLEAN)
    return (
      <div
        className="
        w-8 h-8 rounded-full
        bg-gray-100 flex items-center justify-center
      "
      >
        <ImageIcon size={16} className="text-gray-400" />
      </div>
    );
  };



  // Unique icons for each category


  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50"
          : "bg-white"
        }`}
    >
      <div
        className={`border-b transition-colors ${isScrolled ? "border-transparent" : "border-gray-100"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 md:py-3">
            <div className="flex items-center gap-3 md:gap-4">
              {location.pathname !== "/" && (
                <button
                  onClick={handleGoBack}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 md:mr-2"
                >
                  <ArrowLeft size={22} />
                </button>
              )}
              <div className="flex items-center group mr-4 md:mr-8 select-none">
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <span className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text tracking-tight font-display">
                      L
                    </span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-gray-400 mx-1">&</span>
                  <div className="relative">
                    <span className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text tracking-tight font-display">
                      M
                    </span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative z-50">
              <div
                className="relative w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Clear Button */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 z-10"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit(e);
                    }
                  }}
                  onFocus={() => {
                    if (searchTerm) setShowSuggestions(true);
                  }}
                  className="w-full pl-12 pr-12 py-2.5 border border-gray-200 rounded-2xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                 bg-gray-50 focus:bg-white transition-all shadow-sm
                 text-sm font-medium"
                />

                {/* Search Icon */}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 z-10"
                >
                  <Search size={20} />
                </button>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

                    {/* Searching */}
                    {searchTerm && suggestions.length === 0 && (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        Searching...
                      </p>
                    )}

                    {/* Results */}
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-bold text-gray-400 px-3 py-2 uppercase">
                          Suggestions
                        </p>

                        {suggestions.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleSuggestionClick(product.name)}
                            className="flex items-center gap-4 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="relative text-gray-500 hover:text-red-500 transition-colors group flex flex-col items-center"
              >
                <div className="relative p-2">
                  <Heart
                    size={26}
                    className="group-hover:scale-110 transition-transform stroke-[2]"
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                  Wishlist
                </span>
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="relative text-gray-500 hover:text-blue-600 transition-colors group flex flex-col items-center"
              >
                <div className="relative p-2">
                  <ShoppingCart
                    size={26}
                    className="group-hover:scale-110 transition-transform stroke-[2]"
                  />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                  Cart
                </span>
              </Link>

              {/* USER / AUTH */}
              {isAuthenticated && user ? (
                <div className="relative flex items-center pl-6 border-l border-gray-200 group">
                  <img
                    src={user.avatar || "/avatar-placeholder.png"}
                    alt={user.name || "User avatar"}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover cursor-pointer"
                  />

                  {/* DROPDOWN */}
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 text-gray-700 p-2 text-sm font-bold w-full hover:bg-gray-50 rounded-lg"
                      >
                        <Package size={16} />
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 p-2 text-sm font-bold w-full hover:bg-red-50 rounded-lg"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-blue-600 shadow-md transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Search */}
              <button
                aria-label="Open search"
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2"
              >
                <Search size={22} className="text-gray-600" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative text-gray-600 p-2"
              >
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Menu/Close Button */}
              <button
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X size={22} className="text-gray-600" />
                ) : (
                  <Menu size={22} className="text-gray-600" />
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* =========================
   CATEGORY BAR (HOME ONLY)
========================= */}
      {location.pathname === "/" && (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 min-w-max">
              {categories?.map((cat) => (
                <Link
                  key={cat._id} // ✅ use MongoDB id
                  to={`/shop?category=${cat.slug}`} // ✅ FIXED
                  className="flex flex-col items-center justify-center flex-1 px-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all group mx-1"
                >
                  <div className="flex items-center justify-center w-full h-8">
                    {getCategoryIcon(cat)}
                  </div>
                  <span className="text-[10px] font-semibold whitespace-nowrap text-center leading-tight group-hover:text-blue-700">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================
   MOBILE SEARCH OVERLAY
========================= */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white">
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-2">
            <div className="relative flex-1">
              {/* Clear */}
              {searchTerm && (
                <button
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchTerm("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute left-3 top-3.5 text-gray-500 z-10"
                >
                  <X size={18} />
                </button>
              )}

              {/* Input */}
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                    setIsMobileSearchOpen(false);
                    setShowSuggestions(false);
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Search Button */}
              <button
                aria-label="Search"
                onClick={() => {
                  if (!searchTerm.trim()) return;
                  navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                  setIsMobileSearchOpen(false);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 z-10"
              >
                <Search size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="font-bold text-slate-900"
            >
              Cancel
            </button>
          </div>
          {/* =========================
   MOBILE SEARCH RESULTS
========================= */}
          <div className="p-4 overflow-y-auto h-full pb-20">
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Suggestions
                </p>

                {suggestions.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSuggestionClick(product.name)}
                    className="flex items-center gap-4 p-2 border-b border-gray-50 pb-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {product.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <p className="text-center text-gray-500 mt-10">
                No products found for "{searchTerm}"
              </p>
            ) : null}
          </div>
        </div>
      )}
      {/* =========================
   MOBILE MENU PULL-DOWN
========================= */}
      {/* =========================
   MOBILE MENU (UNDER NAVBAR)
========================= */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden">

          {/* Overlay (below navbar only) */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Pull-down Menu */}
          <div className="absolute left-0 right-0 top-0 bg-white shadow-xl rounded-b-2xl max-h-[70vh] overflow-y-auto">

            {/* Header (NO close button here) */}
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-base font-extrabold text-slate-900">
                Menu
              </span>
            </div>

            {/* Links */}
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
              >
                Home
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="block p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
              >
                Wishlist
              </Link>

              {isAuthenticated && (
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                >
                  My Orders
                </Link>
              )}
            </div>

            {/* Auth */}
            <div className="border-t px-4 py-4">
              {isAuthenticated && user ? (
                <>
                  {/* PROFILE (AVATAR + NAME ONLY) */}
                  <div className="flex items-center gap-3 p-3 mb-3 bg-gray-50 rounded-xl">
                    <img
                      src={user.avatar || "/avatar-placeholder.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border object-cover"
                    />
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {user.name}
                    </p>
                  </div>

                  {/* LOGOUT */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2.5 bg-slate-900 text-white font-bold rounded-lg"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>

          </div>
        </div>
      )}


    </nav>
  );

}
export default Navbar;
