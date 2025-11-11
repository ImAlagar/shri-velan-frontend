// src/pages/OrderSuccess.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShoppingBag, FaHome, FaList, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const OrderSuccess = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your order{isAuthenticated && user?.name ? `, ${user.name}` : ''}. We've sent a confirmation email with your order details.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="text-gray-600">Order Number</p>
                  <p className="font-semibold text-gray-900">#ORD-{Date.now().toString().slice(-8)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
              
              {/* User Info Section */}
              {isAuthenticated && user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <FaUser className="w-4 h-4" />
                    <span>Order placed by: <strong>{user.name}</strong> ({user.email})</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <FaList className="w-5 h-5" />
                    <span>View My Orders</span>
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                  >
                    <FaShoppingBag className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>Login to Track Orders</span>
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                  >
                    <FaShoppingBag className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </Link>
                </>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <FaHome className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Need help? <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium">Contact our support team</Link>
              </p>
              {!isAuthenticated && (
                <p className="text-gray-500 text-sm mt-2">
                  Want to track your orders? <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">Create an account</Link>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;