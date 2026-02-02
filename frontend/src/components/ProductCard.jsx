import React, { memo } from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "@/store/wishlistSlice";
import { useToast } from "@/context/ToastContext.jsx";
import PriceDisplay from "@/components/PriceDisplay.jsx";

const ProductCard = memo(({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  /* ✅ ALWAYS USE _id */
  const productId = product?._id;

  /* ✅ Auth state */
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  /* ✅ Wishlist check (safe) */
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item._id === productId)
  );

  const handleToggleWishlist = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast("Please login to add to wishlist", "info");
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productId));
      addToast("Removed from wishlist", "info");
    } else {
      // ✅ Pass full product (safe for Redux store)
      dispatch(addToWishlistAsync(product));
      addToast("Added to wishlist", "success");
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${productId}`)}
      className="
        group bg-white rounded-2xl shadow-sm hover:shadow-xl
        transition-all duration-300 overflow-hidden cursor-pointer
        flex flex-col h-full border border-gray-100 hover:border-gray-200
        active:scale-[0.98]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product?.isNewArrival && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
              NEW
            </span>
          )}

          {product?.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* WISHLIST */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-lg transition
            ${
              isWishlisted
                ? "bg-white text-red-500"
                : "bg-white text-gray-400 hover:text-red-500"
            }
          `}
        >
          <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[9px] uppercase font-bold text-gray-500">
            {product?.category}
          </span>

          <div className="flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-current" />
            <span className="text-[10px] font-bold">
              {product?.rating ?? 0}
            </span>
            <span className="text-[9px] text-gray-400">
              ({product?.reviews ?? 0})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-xs mb-1 line-clamp-2 leading-tight">
          {product?.name}
        </h3>

        <PriceDisplay
          price={product?.price}
          discountPercentage={product?.discount || 0}
          size="small"
        />
      </div>
    </div>
  );
});

export default ProductCard;
