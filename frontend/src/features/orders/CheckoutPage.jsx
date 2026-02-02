import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store.js";
import { clearCart, removeFromCart, updateQuantity } from "@/store/cartSlice.js";
import { placeOrderAsync } from "@/store/orderSlice.js";
import { useToast } from "@/context/ToastContext.jsx";
import {
  Plus,
  Minus,
  Check,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  ShoppingBag,
  Lock,
  X,
  Trash2,
  Home,
  Briefcase,
  Calendar,
  User,
} from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Success State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Steps: 1 = Address, 2 = Summary, 3 = Payment
  const [currentStep, setCurrentStep] = useState(1);

  // --- ADDRESS STATE ---
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Venkat",
      type: "HOME",
      phone: "7013269473",
      address:
        "Sri Lakshmi balaji guest inn pg, Siddiq Nagar, Lane Number 9, HITEC City, Hyderabad, Rangareddy 500084",
    },
    {
      id: 2,
      name: "Venkat Work",
      type: "WORK",
      phone: "9876543210",
      address:
        "Cyber Towers, Hitech City, Madhapur, Hyderabad, Telangana 500081",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    type: "HOME",
  });

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState(""); // 'gpay', 'phonepe', 'id'
  const [upiId, setUpiId] = useState("");

  // --- CALCULATIONS ---
  // Calculate item details with discounts
  const itemDetails = items.map(item => {
    const discountPercent = item.discount || 0;
    const originalPrice = item.price;
    const discountAmount = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - discountAmount;
    const totalPrice = discountedPrice * item.quantity;
    const totalDiscount = discountAmount * item.quantity;

    return {
      ...item,
      discountPercent,
      discountAmount,
      discountedPrice,
      totalPrice,
      totalDiscount,
    };
  });

  const subtotal = itemDetails.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalDiscount = itemDetails.reduce((sum, item) => sum + item.totalDiscount, 0);
  const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const GST_RATE = 0.18; // 18% GST
  const PLATFORM_FEE = items.length > 0 ? 3 : 0;

  // Delivery charges logic
  let SHIPPING_COST = 0;
  if (subtotal < 500) {
    SHIPPING_COST = Math.floor(Math.random() * 11) + 30; // ₹30-40
  } else if (subtotal < 1000) {
    SHIPPING_COST = Math.floor(Math.random() * 11) + 20; // ₹20-30
  } else {
    SHIPPING_COST = 0; // Free delivery
  }

  const gstAmount = subtotal * GST_RATE;
  const finalTotal = subtotal + gstAmount + SHIPPING_COST + PLATFORM_FEE;

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!isAuthenticated) {
      addToast("Please login to continue", "info");
      navigate("/login?redirect=/checkout");
    }
  }, [isAuthenticated, navigate, addToast]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, isOrderPlaced]);

  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced) {
      navigate("/shop");
    }
  }, [items.length, navigate, isOrderPlaced]);

  // Auto navigate to My Orders after successful order placement
  useEffect(() => {
    if (isOrderPlaced && placedOrderId) {
      const timer = setTimeout(() => {
        navigate("/orders"); // Navigate to My Orders page
      }, 6000); // 7.5 seconds (between 7-8 seconds)

      return () => clearTimeout(timer);
    }
  }, [isOrderPlaced, placedOrderId, navigate]);

  // --- ADDRESS HANDLERS ---
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      addToast("Please fill all address fields", "error");
      return;
    }
    const newId = Date.now();
    const addressObj = {
      id: newId,
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      type: newAddress.type,
    };
    setAddresses([...addresses, addressObj]);
    setSelectedAddressId(newId);
    setShowAddressForm(false);
    setNewAddress({ name: "", phone: "", address: "", type: "HOME" });
    addToast("Address added successfully", "success");
  };

  const handleDeleteAddress = (e, id) => {
    e.stopPropagation();
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    setAddresses(updatedAddresses);
    if (selectedAddressId === id) {
      setSelectedAddressId(
        updatedAddresses.length > 0 ? updatedAddresses[0].id : null
      );
    }
    addToast("Address deleted", "info");
  };

  // --- CARD & PAYMENT HANDLERS ---
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "number")
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    else if (name === "expiry")
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(?=\d)/g, "$1/");
    else if (name === "cvv")
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      addToast("Please select a delivery address", "error");
      return;
    }

    if (!paymentMethod) {
      addToast("Please select a payment method", "error");
      return;
    }

    if (!items || items.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (finalTotal <= 0) {
      addToast("Invalid order total", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item._id || item.id,   // ✅ backend expects "product"
          name: item.name,                // ✅ required
          price: item.price,              // ✅ required
          quantity: Number(item.quantity), // ✅ required
          image: item.image,              // ✅ optional but safe
        })),
        totalAmount: Number(finalTotal.toFixed(2)),
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: selectedAddress,
      };

      console.log("Sending order payload 👉", orderPayload);


      // 🔥 freeze items (VERY IMPORTANT)
      const frozenItems = JSON.parse(JSON.stringify(orderPayload.items));

      const order = await dispatch(
        placeOrderAsync({
          items: frozenItems,
          totalAmount: orderPayload.totalAmount,
          paymentMethod: orderPayload.paymentMethod,
          shippingAddress: orderPayload.shippingAddress,
        })
      ).unwrap();

      dispatch(clearCart());

      setPlacedOrderId(order.orderNumber || order._id || "");
      setIsOrderPlaced(true);

      // Show success message immediately
      addToast("Order placed successfully!", "success");
    } catch (error) {
      console.error("Order placement failed:", error);
      addToast(
        typeof error === "string"
          ? error
          : "Failed to place order. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Better auth guard UX
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  // --- SUCCESS VIEW ---
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-green-50/50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-md w-full animate-slide-up-fade">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600 stroke-[3]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Successful!
          </h2>
          <p className="text-gray-500 mb-6">
            Order ID:{" "}
            <span className="font-bold text-gray-900">{placedOrderId}</span>
          </p>
          <button
            onClick={() => navigate(`/order-tracking/${placedOrderId}`)}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
          >
            Track Order
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Redirecting to My Orders in a few seconds...
          </p>
        </div>
      </div>
    );
  }


  const steps = [
    { number: 1, title: "Address", icon: MapPin },
    { number: 2, title: "Summary", icon: ShoppingBag },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  const paymentMethods = [
    {
      id: "upi",
      label: "UPI",
      description: "Google Pay, PhonePe",
      icon: Smartphone,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      description: "Visa, Mastercard",
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      description: "Pay upon delivery",
      icon: Banknote,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-32 md:pb-12">
      <div className="bg-white shadow-sm sticky top-16 md:top-[70px] z-30 w-full transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 rounded-full -z-10" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 rounded-full -z-10 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
            {steps.map((step) => {
              const isActive = currentStep >= step.number;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${isActive ? "opacity-100" : "opacity-60"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-400"
                      }`}
                  >
                    <step.icon size={14} />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${isActive ? "text-indigo-900" : "text-gray-400"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {currentStep === 1 && (
              <div className="animate-slide-in space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} /> Add New
                  </button>
                </div>
                <div className="grid gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${selectedAddressId === addr.id
                        ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id
                            ? "border-indigo-600"
                            : "border-gray-300"
                            }`}
                        >
                          {selectedAddressId === addr.id && (
                            <div className="w-2 h-2 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {addr.name}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded text-xs font-bold ${addr.type === "HOME"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {addr.type}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleDeleteAddress(e, addr.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {addr.address}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {addr.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="animate-slide-in space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Delivering To
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedAddress?.name},{" "}
                      {selectedAddress?.address.substring(0, 25)}...
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-indigo-600 text-xs font-bold hover:underline"
                  >
                    CHANGE
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-bold text-sm text-gray-700">
                      Items ({items.length})
                    </span>
                  </div>
                  {itemDetails.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex gap-4 border-b border-gray-50 last:border-0"
                    >
                      <img
                        src={item.image}
                        className="w-16 h-16 bg-gray-100 rounded-lg object-cover"
                        alt={item.name}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-sm text-gray-900 line-clamp-1">
                            {item.name}
                          </p>
                          <button
                            onClick={() => dispatch(removeFromCart({ id: item._id || item.id, selectedSize: item.selectedSize }))}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          Size: {item.selectedSize}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => dispatch(updateQuantity({
                                id: item._id || item.id,
                                quantity: item.quantity - 1,
                                selectedSize: item.selectedSize
                              }))}
                              className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 font-semibold text-gray-900 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateQuantity({
                                id: item._id || item.id,
                                quantity: item.quantity + 1,
                                selectedSize: item.selectedSize
                              }))}
                              className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-bold text-gray-900">
                              ₹{item.totalPrice.toFixed(2)}
                            </p>
                            {item.discountPercent > 0 && (
                              <p className="text-xs text-gray-500 line-through">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="animate-slide-in space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Payment Method
                </h3>
                <div className="grid gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex flex-col">
                      <div
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center gap-4 transition-all
                          ${paymentMethod === method.id
                            ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600 z-10"
                            : "border-gray-200 bg-white"
                          }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${method.bg} ${method.color}`}
                        >
                          <method.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">
                            {method.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id
                            ? "border-indigo-600"
                            : "border-gray-300"
                            }`}
                        >
                          {paymentMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          )}
                        </div>
                      </div>
                      {method.id === "upi" && paymentMethod === "upi" && (
                        <div className="mt-2 ml-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-in">
                          <p className="text-xs font-bold text-gray-500 mb-3 uppercase">
                            Select App
                          </p>
                          <div className="flex gap-3 mb-4">
                            <button
                              onClick={() => setSelectedUpiApp("gpay")}
                              className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 font-bold text-sm transition-all ${selectedUpiApp === "gpay"
                                ? "bg-white border-indigo-600 text-indigo-700 shadow-sm"
                                : "bg-white border-gray-200 text-gray-600"
                                }`}
                            >
                              <span className="text-blue-500">G</span>Pay
                            </button>
                            <button
                              onClick={() => setSelectedUpiApp("phonepe")}
                              className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 font-bold text-sm transition-all ${selectedUpiApp === "phonepe"
                                ? "bg-purple-50 border-purple-600 text-purple-700 shadow-sm"
                                : "bg-white border-gray-200 text-gray-600"
                                }`}
                            >
                              PhonePe
                            </button>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-gray-50 px-2 text-gray-500">
                                Or
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="text-xs font-bold text-gray-500">
                              UPI ID
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 9876543210@upi"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setSelectedUpiApp("id");
                              }}
                              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:border-indigo-600 outline-none"
                            />
                          </div>
                        </div>
                      )}
                      {method.id === "card" && paymentMethod === "card" && (
                        <div className="mt-2 ml-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-in space-y-3">
                          <div>
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              <CreditCard size={12} /> Card Number
                            </label>
                            <input
                              type="text"
                              name="number"
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              value={cardDetails.number}
                              onChange={handleCardInputChange}
                              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:border-indigo-600 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> Expiry
                              </label>
                              <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardDetails.expiry}
                                onChange={handleCardInputChange}
                                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-sm text-center focus:border-indigo-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                <Lock size={12} /> CVV
                              </label>
                              <input
                                type="password"
                                name="cvv"
                                placeholder="123"
                                maxLength={3}
                                value={cardDetails.cvv}
                                onChange={handleCardInputChange}
                                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-sm text-center focus:border-indigo-600 outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              <User size={12} /> Name on Card
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder="John Doe"
                              value={cardDetails.name}
                              onChange={handleCardInputChange}
                              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:border-indigo-600 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Banknote size={18} className="text-indigo-600" /> Order Summary
              </h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Total Amount ({items.length} items)</span>
                  <span>₹{originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600 font-medium">
                    -₹{totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span
                    className={
                      SHIPPING_COST === 0
                        ? "text-green-600 font-bold"
                        : "text-gray-900"
                    }
                  >
                    {SHIPPING_COST === 0 ? "Free" : `₹${SHIPPING_COST}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span>₹{PLATFORM_FEE}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-black text-gray-900">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  currentStep === 1
                    ? setCurrentStep(2)
                    : currentStep === 2
                      ? setCurrentStep(3)
                      : handlePayment()
                }
                disabled={
                  isProcessing || (currentStep === 1 && addresses.length === 0)
                }
                className="hidden lg:flex w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all items-center justify-center gap-2"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    {currentStep === 3 ? "Place Order" : "Proceed"}{" "}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">
                Add New Address
              </h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Complete Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600 resize-none"
                  placeholder="House No, Street, Landmark, City, Pincode"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Address Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNewAddress({ ...newAddress, type: "HOME" })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${newAddress.type === "HOME"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                      }`}
                  >
                    <Home size={16} /> Home
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewAddress({ ...newAddress, type: "WORK" })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${newAddress.type === "WORK"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                      }`}
                  >
                    <Briefcase size={16} /> Work
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 mt-4"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 p-3 shadow-lg lg:hidden z-40">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">
              Total
            </span>
            <span className="text-lg font-black text-gray-900">
              ₹{finalTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() =>
              currentStep === 1
                ? setCurrentStep(2)
                : currentStep === 2
                  ? setCurrentStep(3)
                  : handlePayment()
            }
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            {currentStep === 3 ? "Place Order" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
