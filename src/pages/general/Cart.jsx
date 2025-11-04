// src/pages/Cart.jsx
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useValidateCoupon } from '../../hooks/useCoupons';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    clearCart,
    getCartItemsCount
  } = useContext(CartContext);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  const validateCouponMutation = useValidateCoupon();

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const shippingFee = 49;
  const discount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' 
      ? (calculateSubtotal() * appliedCoupon.value) / 100 
      : Math.min(appliedCoupon.value, calculateSubtotal())
    ) : 0;
  
  const total = calculateSubtotal() + shippingFee - discount;

  // Separate in-stock and out-of-stock items
  const inStockItems = cartItems.filter(item => item.inStock !== false && item.stock > 0);
  const outOfStockItems = cartItems.filter(item => item.inStock === false || item.stock <= 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const result = await validateCouponMutation.mutateAsync(couponCode);
      if (result.success) {
        setAppliedCoupon(result.data);
        toast.success('Coupon applied successfully!');
      } else {
        toast.error(result.message || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (inStockItems.length === 0) {
      toast.error('Please add available items to proceed with checkout');
      return;
    }

    navigate('/checkout');
  };

  // Helper function to safely get category name
  const getCategoryName = (item) => {
    if (!item.category) return 'Uncategorized';
    
    if (typeof item.category === 'object' && item.category !== null) {
      return item.category.name || 'Uncategorized';
    }
    
    return item.category;
  };

  // Helper function to safely get item weight
  const getItemWeight = (item) => {
    return item.weight || '1kg';
  };

  // Helper function to get item price (prioritize offerPrice)
  const getItemPrice = (item) => {
    return item.offerPrice || item.price || 0;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any organic goodies to your cart yet. Start shopping to fill it with healthy choices!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

            {/* Left Section (Back link + Heading) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm sm:text-base">Continue Shopping</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>

            {/* Right Section (Items Count + Clear Button) */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <p className="text-sm text-gray-600">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? "item" : "items"}
              </p>

              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 transition"
                >
                  Clear Cart
                </button>
              )}
            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Coupon Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply Coupon Code</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>

              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h2>

                  <div className="space-y-4">
                    {inStockItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <img
                          src={item.image || item.images?.[0] || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                        />

                        <div className="flex-1 w-full">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{getCategoryName(item)} • {getItemWeight(item)}</p>
                          <p className="text-lg font-bold text-green-600">₹{getItemPrice(item)}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-between">
                          {/* Quantity Buttons */}
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 border flex items-center justify-center rounded-lg">
                              <FaMinus className="text-gray-600" />
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.stock && item.quantity >= item.stock}
                              className="w-8 h-8 border flex items-center justify-center rounded-lg">
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="text-right">
                            <p className="font-bold">₹{(getItemPrice(item) * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm mt-2">
                              <FaTrash className="inline-block mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({inStockItems.length} items)</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={inStockItems.length === 0}
                  className={`w-full ${
                    inStockItems.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2`}
                >
                  <FaCreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>

                {!user && (
                  <p className="text-sm text-orange-600 text-center mt-3">
                    Please login to checkout
                  </p>
                )}

                {inStockItems.length === 0 && (
                  <p className="text-sm text-orange-600 text-center mt-3">
                    Add available items to checkout
                  </p>
                )}

                {/* Security Features */}
                <div className="mt-6 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free returns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;