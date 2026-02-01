import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  fetchWishlist,
  removeFromWishlistAsync,
} from "../../store/wishlistSlice";
import { logout } from "../../store/authSlice";
import ProductCard from "../../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useAppSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/wishlist", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch wishlist only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlistAsync(productId)).unwrap();
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading wishlist...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-red-500 mb-4">
            Failed to load wishlist
          </p>
          <button
            onClick={() => dispatch(fetchWishlist())}
            className="text-blue-600 font-medium hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Wishlist
        </h1>

        <p className="text-gray-500 mb-8">
          {items.length} {items.length === 1 ? "item" : "items"} saved for later
        </p>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">
              Your wishlist is empty.
            </p>
            <Link
              to="/shop"
              className="text-blue-600 font-medium hover:underline"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
