import React from 'react';

const PriceDisplay = ({ price, discountPercentage, discountedPrice, size = "large" }) => {
  // Calculate discounted price if not provided
  const finalDiscountedPrice = discountedPrice || (price - (price * (discountPercentage || 0) / 100));
  const hasDiscount = discountPercentage > 0;

  const priceClasses = size === "small"
    ? "text-lg font-semibold text-slate-900"
    : "text-3xl font-black text-slate-900";

  return (
    <div className="flex flex-col">
      {/* Discounted Price - Primary, bold, large */}
      <span className={priceClasses}>
        ₹{finalDiscountedPrice.toFixed(2)}
      </span>

      {/* Original Price + Discount - Only if there's a discount */}
      {hasDiscount && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500 line-through">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-sm text-green-600 font-medium">
            {discountPercentage}% off
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;