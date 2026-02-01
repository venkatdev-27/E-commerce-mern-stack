import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import { useToast } from '../../context/ToastContext';

const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useAppSelector(state => state.cart);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const { addToast } = useToast();

    // Calculate discounts and totals
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

    const finalTotal = subtotal;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            addToast('Please login to complete your purchase', 'info');
            navigate('/login?redirect=/checkout');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <div className="bg-white p-6 rounded-full shadow-lg mb-6 inline-block">
                        <ArrowRight size={48} className="text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Looks like you haven't added anything yet. Explore our categories to find your next favorite item.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
                    >
                        Start Shopping <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {itemDetails.map((item, idx) =>
                            <Link
                                key={`${item.id}-${item.selectedSize || idx}`}
                                to={`/product/${item._id || item.id}`}
                                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md border border-gray-100 group"
                            >
                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {item.discount && (
                                        <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                                            -{item.discount}%
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    dispatch(removeFromCart({ id: item._id || item.id, selectedSize: item.selectedSize }));
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 items-center mb-4">
                                            <p className="text-sm text-gray-500 capitalize bg-gray-100 w-fit px-2 py-0.5 rounded text-xs font-semibold">
                                                {item.category}
                                            </p>
                                            {item.selectedSize && (
                                                <p className="text-sm text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded text-xs font-bold border border-blue-100">
                                                    Size: {item.selectedSize}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    dispatch(updateQuantity({
                                                        id: item._id || item.id,
                                                        quantity: item.quantity - 1,
                                                        selectedSize: item.selectedSize
                                                    }));
                                                }}
                                                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-4 font-semibold text-gray-900 min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    dispatch(updateQuantity({
                                                        id: item._id || item.id,
                                                        quantity: item.quantity + 1,
                                                        selectedSize: item.selectedSize
                                                    }));
                                                }}
                                                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">
                                                Price per unit: {item.discountPercent > 0 ? (
                                                    <>
                                                        ₹{item.discountedPrice.toFixed(2)}
                                                        <span className="line-through text-gray-300 ml-1">₹{item.price.toFixed(2)}</span>
                                                        <span className="text-green-600 ml-1">(-{item.discountPercent}%)</span>
                                                    </>
                                                ) : (
                                                    `₹${item.price.toFixed(2)}`
                                                )}
                                            </p>
                                            <span className="font-bold text-xl text-gray-900">
                                                ₹{item.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Price Details
                            </h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
                                    </span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount</span>
                                    <span className="text-green-600 font-medium">
                                        -₹{totalDiscount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-4" />
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total Amount</span>
                                    <span>₹{finalTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-green-600 font-medium mt-2">
                                    You will save on shipping for this order!
                                </p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center group"
                            >
                                Proceed to Checkout{" "}
                                <ArrowRight
                                    size={20}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                            <div className="mt-6 flex items-center justify-center text-gray-400 text-xs gap-2">
                                <ShieldCheck size={14} />
                                <span>
                                    Safe and Secure Payments. 100% Authentic products.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
