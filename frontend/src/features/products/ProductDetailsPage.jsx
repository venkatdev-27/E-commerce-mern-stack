import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCcw,
  ShieldCheck
} from "lucide-react";

import { getProductById } from "@/src/api";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCart } from "@/store/cartSlice";
import { addToWishlistAsync } from "@/store/wishlistSlice";
import { useToast } from "@/context/ToastContext";
import PriceDisplay from "@/components/PriceDisplay.jsx";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-slate-900 rounded-full" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-blue-600 font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  /* ================= HANDLERS ================= */
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast("Please login to add items to cart", "info");
      navigate("/login");
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      addToast("Please select a size", "error");
      return;
    }

    dispatch(addToCart({ ...product, selectedSize: selectedSize || undefined }));
    addToast("Added to cart", "success");
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      addToast("Please login to add to wishlist", "info");
      navigate("/login");
      return;
    }

    dispatch(addToWishlistAsync(product));
    addToast("Added to wishlist", "success");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl">

        {/* IMAGE */}
        <div>
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full rounded-xl"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col">
          <span className="text-sm text-blue-600 font-bold uppercase">
            {product.category}
          </span>

          <h1 className="text-3xl font-extrabold mt-2">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
              {product.rating || 4} <Star size={12} fill="white" />
            </span>
            <span className="text-gray-500 text-sm">
              {(product.reviews || 0).toLocaleString()} reviews
            </span>
          </div>

          <div className="mt-6">
            <PriceDisplay
              price={product.price}
              discountPercentage={product.discount || 0}
            />
          </div>

          {/* SIZES */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">Select Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={
                      `px-4 py-2 border rounded ${
                        selectedSize === size
                          ? "bg-blue-600 text-white"
                          : "bg-white"
                      }`
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="border px-5 rounded-lg flex items-center gap-2"
            >
              <Heart size={18} /> Wishlist
            </button>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-4 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Truck size={16} /> Free Delivery
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw size={16} /> 30-Day Return
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} /> Warranty
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} /> Secure Payment
            </div>
          </div>
        </div>
      </div>

      {/* SPECIFICATIONS & REVIEWS */}
      <div className="max-w-7xl mx-auto bg-white mt-8 p-8 rounded-2xl">
        <div className="flex gap-6 border-b pb-4">
          <button
            onClick={() => setActiveTab("specs")}
            className={activeTab === "specs" ? "font-bold text-blue-600" : ""}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={activeTab === "reviews" ? "font-bold text-blue-600" : ""}
          >
            Reviews ({product.reviews || 0})
          </button>
        </div>

        {activeTab === "specs" && (
          <div className="mt-6">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Product Specifications</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(product.specifications).slice(0, Math.ceil(Object.keys(product.specifications).length / 2)).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.sizes?.length > 0 && (
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Size & Fit</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available Sizes:</span>
                          <span className="font-medium text-gray-900">{product.sizes.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Additional Details</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(product.specifications).slice(Math.ceil(Object.keys(product.specifications).length / 2)).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Features</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Premium quality materials
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Comfortable and stylish design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Durable and long-lasting
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Easy care and maintenance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Specifications Not Available</h3>
                <p className="text-gray-600">Detailed specifications for this product are currently being updated.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{product.rating || 4.5}</div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={(product.rating || 4.5) >= star ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{product.reviews || 0} reviews</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-gray-600">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Sample Reviews */}
              {[
                {
                  name: "Rahul Sharma",
                  rating: 5,
                  date: "2 weeks ago",
                  review: "Excellent quality product! The fabric is very comfortable and the fit is perfect. Highly recommend!",
                  verified: true
                },
                {
                  name: "Priya Patel",
                  rating: 4,
                  date: "1 month ago",
                  review: "Good product overall. The material quality is nice and it arrived on time. Minor sizing issue but manageable.",
                  verified: true
                },
                {
                  name: "Amit Kumar",
                  rating: 5,
                  date: "3 weeks ago",
                  review: "Amazing product! Exactly as described. The quality is top-notch and customer service was excellent.",
                  verified: true
                },
                {
                  name: "Sneha Gupta",
                  rating: 4,
                  date: "1 week ago",
                  review: "Very satisfied with the purchase. The product looks exactly like in the pictures and the quality is good.",
                  verified: true
                }
              ].map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{review.name}</span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={review.rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>

            {(!product.reviews || product.reviews === 0) && (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
