import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useReducer, useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ProductCard from "@/components/ProductCard.jsx";
import { getProducts, getBrands, getCategories } from "@/api";
import { SearchX, Home, ChevronDown } from "lucide-react";




const initialState = {
  category: "all",
  minPrice: 0,
  maxPrice: 50000,
  searchQuery: "",
  selectedBrands: [],

};

function filterReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_INITIAL_STATE":
      return { ...initialState, ...action.payload };
    case "TOGGLE_BRAND":
      return {
        ...state,
        selectedBrands:
          Array.isArray(state.selectedBrands) &&
            state.selectedBrands.includes(action.payload)
            ? state.selectedBrands.filter((b) => b !== action.payload)
            : [...(state.selectedBrands || []), action.payload],
      };


    case "SET_PRICE_RANGE":
      return {
        ...state,
        minPrice: action.payload.min,
        maxPrice: action.payload.max,
      };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(filterReducer, {
    ...initialState,
    category: searchParams.get("category") || "all",
    searchQuery: searchParams.get("search") || "",
  });
  const [sortBy, setSortBy] = useState("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // API data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [categories, setCategories] = useState([]);

  // Filter options from API
  const [uniqueBrands, setUniqueBrands] = useState([]);


  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [brandsRes] = await Promise.all([
          getBrands(),

        ]);
        setUniqueBrands(brandsRes);

      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };
    loadFilterOptions();
  }, []);



  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        // Extract categories array from response: { success: true, categories: [...] }
        setCategories(res?.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);



  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    // If no category param, try to get it from the URL path
    let finalCategory = categoryParam || "all";
    if (!categoryParam) {
      const path = location.pathname;
      // Extract category from path like /electronics -> electronics
      const pathCategory = path.split('/')[1];
      if (pathCategory && pathCategory !== 'shop') {
        finalCategory = pathCategory;
      }
    }

    dispatch({ type: "SET_CATEGORY", payload: finalCategory });
    dispatch({ type: "SET_SEARCH", payload: searchParam || "" });
  }, [searchParams, location.pathname]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          category: state.category, // ✅ Pass slug or ID directly (backend handles lookup)
          search: state.searchQuery || undefined,
          brands: state.selectedBrands.length
            ? state.selectedBrands.join(",")
            : undefined,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          sortBy,
          page,
          limit: state.category === "all" ? 100 : 50,
        };

        // remove empty params
        Object.keys(params).forEach(
          (key) => params[key] === undefined && delete params[key]
        );

        const res = await getProducts(params);

        setProducts(res.products || []);
        setTotal(res.total || 0);
        setHasMore(res.hasMore || false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // 🚨 wait until categories are loaded
    if (categories.length) {
      fetchProducts();
    }
  }, [state, sortBy, page, categories]);

  // Filtered products (now just the API response)
  const filteredProducts = products || [];
  // Filter Sidebar Component - REMOVED
  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="bg-red-50 p-6 rounded-full mb-6 mx-auto max-w-sm">
                <SearchX size={48} className="text-red-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Something went wrong
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-600"
            >
              <Home size={18} />
            </button>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-slate-900 capitalize text-lg font-display">
              {state.category.replace("-", " ")}
            </span>
            {state.searchQuery && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-blue-600 font-medium truncate max-w-[200px]">
                  Search: "{state.searchQuery}"
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-auto flex items-center space-x-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 cursor-pointer">
              <span className="text-sm text-gray-500 hidden sm:inline font-medium">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto border-none text-sm font-bold focus:ring-0 cursor-pointer text-gray-900 bg-transparent outline-none appearance-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {total} products
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                <SearchX size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                No products found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                No products found
                {state.searchQuery && ` for "${state.searchQuery}"`}
                {state.category !== "all" && ` in "${state.category.replace("-", " ")}"`}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ShopPage;
