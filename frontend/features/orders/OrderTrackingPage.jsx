import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  Check,
  Clock,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchOrderById } from "../../store/orderSlice";
import { getProductById } from "../../src/api/product.api";

/* ======================================================
   DATE HELPERS (IST - Asia/Kolkata)
====================================================== */

// Convert date to IST Date object
const toISTDate = (date) => {
  return new Date(
    new Date(date).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
};

// Format IST date and time
const formatISTDateTime = (date) => {
  if (!date) return { date: "", time: "" };

  const istDate = toISTDate(date);

  return {
    date: istDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: istDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

// Add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/* ======================================================
   COMPONENT
====================================================== */

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentOrder, loading, error } = useAppSelector(
    (state) => state.orders
  );

  const [products, setProducts] = useState([]);

  /* ======================================================
     FETCH ORDER
  ====================================================== */
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }

    return () => {
      dispatch({ type: "orders/clearOrders" });
    };
  }, [orderId, dispatch]);

  /* ======================================================
     DATA PREPARATION
  ====================================================== */
  const order = currentOrder;
  const items = Array.isArray(order?.items) ? order.items : [];

  /* ======================================================
     FETCH PRODUCTS FOR DISCOUNT CALCULATION
  ====================================================== */
  useEffect(() => {
    if (items.length > 0) {
      const fetchProducts = async () => {
        try {
          const productPromises = items.map(item => getProductById(item.product));
          const productData = await Promise.all(productPromises);
          setProducts(productData);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      };
      fetchProducts();
    }
  }, [items]);

  /* ======================================================
     LOADING STATE
  ====================================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading order...</span>
      </div>
    );
  }

  /* ======================================================
     ERROR STATE
  ====================================================== */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Package size={40} className="text-red-400 mb-4" />
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchOrderById(orderId))}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ======================================================
     EMPTY STATE
  ====================================================== */
  if (!currentOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Package size={40} className="text-gray-400 mb-4" />
        <p className="text-gray-500 mb-6">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go to Orders
        </button>
      </div>
    );
  }

  // Base date from order.createdAt (converted to IST)
  const baseDate = toISTDate(order.createdAt);

  // Calculate tracking dates
  const orderPlacedDate = baseDate;
  const confirmedDate = addDays(baseDate, 1);
  const shippedDate = addDays(baseDate, 3);
  const deliveredDate = addDays(baseDate, 5);
  deliveredDate.setHours(22, 30, 0, 0); // Set to 10:30 PM IST

  // Create product discount map
  const productDiscounts = products.reduce((map, product) => {
    map[product._id] = product.discount || 0;
    return map;
  }, {});

  // Calculate item details with discounts
  // Calculate item details with discounts
  const itemDetails = items.map(item => {
    const discountPercent = productDiscounts[item.product] || 0;

    // Original Price (Sticker Price)
    const originalPrice = item.price;

    const discountAmount = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - discountAmount;

    const totalOriginalPrice = originalPrice * item.quantity;
    const totalDiscount = discountAmount * item.quantity;
    const totalDiscountedPrice = discountedPrice * item.quantity;

    return {
      ...item,
      discountPercent,
      discountAmount,
      discountedPrice,
      originalPrice,
      totalOriginalPrice,
      totalDiscount,
      totalDiscountedPrice,
    };
  });

  // 1. Gross Subtotal (Sum of Original Prices)
  const subtotal = itemDetails.reduce((sum, item) => sum + item.totalOriginalPrice, 0);
  const totalDiscount = itemDetails.reduce((sum, item) => sum + item.totalDiscount, 0);

  // 2. Net Taxable Amount
  const discountedSubtotal = subtotal - totalDiscount;

  // 3. Tax (GST 18%)
  const GST_RATE = 0.18;
  const gstAmount = discountedSubtotal * GST_RATE;

  // 4. Delivery charges (based on discounted value)
  let delivery = 0;
  if (discountedSubtotal < 500) {
    delivery = Math.floor(Math.random() * 31) + 40;
  } else if (discountedSubtotal < 1000) {
    delivery = Math.floor(Math.random() * 21) + 20;
  } else {
    delivery = 0;
  }

  // 5. Final Total
  const calculatedTotal = discountedSubtotal + gstAmount + delivery;

  /* ======================================================
     TRACKING STEPS CONFIGURATION
  ====================================================== */
  const steps = [
    {
      label: "Order Placed",
      done: true, // Always completed
      icon: Clock,
      ...formatISTDateTime(orderPlacedDate),
      description: "Your order has been confirmed",
    },
    {
      label: "Confirmed",
      done: ["Confirmed", "Shipped", "Delivered"].includes(order.status),
      icon: Package,
      ...formatISTDateTime(confirmedDate),
      description: "Your order has been confirmed and is being processed",
    },
    {
      label: "Shipped",
      done: ["Shipped", "Delivered"].includes(order.status),
      icon: Truck,
      ...formatISTDateTime(shippedDate),
      description: "Your order has been shipped",
    },
    {
      label: "Delivered",
      done: order.status === "Delivered",
      icon: Check,
      ...formatISTDateTime(deliveredDate),
      description: "Your order has been delivered",
    },
  ];

  /* ======================================================
     RENDER UI
  ====================================================== */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* BACK NAVIGATION */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft size={18} /> Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* ORDER HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1">
              Order {order.status}
            </h1>
            <p className="text-gray-500 text-sm">
              Order ID: <span className="font-mono">{order.orderNumber}</span>
            </p>
          </div>

          {/* ORDER TRACKING */}
          <div className="mb-10">
            <h3 className="font-bold mb-6 text-center">Order Tracking</h3>

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${step.done
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    <step.icon size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold">{step.label}</p>
                      <p className="text-sm text-gray-500">
                        {step.label === "Delivered" ? `${step.date} • ${step.time}` : step.date}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER ITEMS */}
          <h3 className="font-bold mb-4">Items ({itemDetails.length})</h3>

          <div className="space-y-4 mb-6">
            {itemDetails.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border rounded-xl p-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Price: ₹{item.price.toFixed(2)}</p>
                  {item.discountPercent > 0 && (
                    <>
                      <p className="text-sm text-green-600">
                        Discount: {item.discountPercent}% off
                      </p>
                      <p className="text-sm text-gray-500">

                      </p>
                    </>
                  )}
                </div>
                <p className="font-bold">₹{item.totalOriginalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* ORDER TOTAL */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Total Amount </span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
                      <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className={delivery === 0 ? "text-green-600 font-bold" : ""}>
                {delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 text-lg">
              <span>Final Amount</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* CONTINUE SHOPPING CTA */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
