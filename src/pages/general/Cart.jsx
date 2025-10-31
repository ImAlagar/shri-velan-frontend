// src/pages/Cart.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    clearCart 
  } = useContext(CartContext);

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const shippingFee = calculateSubtotal() > 500 ? 0 : 49;
  const total = calculateSubtotal() + shippingFee;

  // Separate in-stock and out-of-stock items
  const inStockItems = cartItems.filter(item => item.inStock !== false);
  const outOfStockItems = cartItems.filter(item => item.inStock === false);

  // Helper function to safely get category name
  const getCategoryName = (item) => {
    if (!item.category) return 'Uncategorized';
    
    // If category is an object, get the name property
    if (typeof item.category === 'object' && item.category !== null) {
      return item.category.name || 'Uncategorized';
    }
    
    // If category is a string, return it directly
    return item.category;
  };

  // Helper function to safely get item weight
  const getItemWeight = (item) => {
    return item.weight || '1kg';
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
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h2>
                  <div className="space-y-4">
                    {inStockItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-green-200 transition-colors"
                      >
                        <img
                          src={item.image || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {getCategoryName(item)} • {getItemWeight(item)}
                          </p>
                          <p className="text-lg font-bold text-green-600">₹{item.price}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right sm:text-left">
                            <p className="text-lg font-bold text-gray-900">
                              ₹{item.price * item.quantity}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center space-x-1 sm:mx-auto"
                            >
                              <FaTrash className="w-4 h-4" />
                              <span className="text-sm sm:hidden">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-200">
                  <h2 className="text-lg font-semibold text-orange-800 mb-4">Out of Stock</h2>
                  <div className="space-y-4">
                    {outOfStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50"
                      >
                        <img
                          src={item.image || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg opacity-60 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-500 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {getCategoryName(item)} • {getItemWeight(item)}
                          </p>
                          <p className="text-lg font-bold text-gray-500">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                          >
                            <FaTrash className="w-4 h-4" />
                            <span className="text-sm sm:hidden">Remove</span>
                          </button>
                        </div>
                      </div>
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
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                  </div>
                  {shippingFee > 0 && calculateSubtotal() < 500 && (
                    <p className="text-sm text-green-600">
                      Add ₹{500 - calculateSubtotal()} more for free shipping!
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className={`w-full ${
                    inStockItems.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2`}
                  onClick={(e) => {
                    if (inStockItems.length === 0) {
                      e.preventDefault();
                    }
                  }}
                >
                  <FaCreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </Link>

                {inStockItems.length === 0 && (
                  <p className="text-sm text-orange-600 text-center mt-3">
                    Add available items to checkout
                  </p>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;