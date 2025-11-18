// src/pages/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaWallet, FaArrowLeft, FaTruck, FaTag, FaWeightHanging, FaShippingFast } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useCreateRazorpayOrder, useVerifyPayment } from '../../hooks/useOrders';
import { useValidateCoupon, useAvailableCoupons } from '../../hooks/useCoupons';
import { useCalculateOrderShipping } from '../../hooks/useShipping';
import { FolderLock } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingRate, setShippingRate] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  
  const createRazorpayOrderMutation = useCreateRazorpayOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const validateCouponMutation = useValidateCoupon();
  const calculateOrderShippingMutation = useCalculateOrderShipping();

  // Available courier options - FIXED: Removed duplicate label key
  const courierOptions = [
    { value: 'professional', label: 'Professional Courier', description: 'Standard delivery (3-5 days)' },
    { value: 'delhivery', label: 'Delhivery', description: 'Fast delivery (2-4 days)' },
    { value: 'bluedart', label: 'Blue Dart', description: 'Premium delivery (1-3 days)' },
    { value: 'dtdc', label: 'DTDC', description: 'Economy delivery (4-7 days)' }, // FIXED: Removed duplicate label
    { value: 'others', label: 'Others', description: 'We will choose the best available courier' }
  ];

  // Pre-fill form with user data if available
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    paymentMethod: 'card',
    preferredCourier: '', // New field
    courierInstructions: '' // New field
  });

  // Safe cart items processing (keep your existing function)
  const getSafeCartItems = () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return [];
    }
    
    return cartItems
      .filter(item => item && item.inStock !== false && (item.stock > 0 || item.stock === undefined))
      .map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name || 'Unknown Product',
        price: item.price || 0,
        offerPrice: item.offerPrice || item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || item.images?.[0] || '/images/placeholder.jpg',
        stock: item.stock || 0,
        inStock: item.inStock !== false,
        weight: item.weight || '1kg',
        category: item.category || 'Uncategorized'
      }));
  };

  const inStockItems = getSafeCartItems();
  const subtotal = getCartTotal();

  // Use available coupons in checkout too
  const { data: availableCouponsData } = useAvailableCoupons(subtotal);
  const availableCoupons = Array.isArray(availableCouponsData) 
    ? availableCouponsData 
    : availableCouponsData?.data || availableCouponsData?.coupons || [];

  // Calculate shipping when state or items change
  useEffect(() => {
    if (formData.state && formData.state.trim().length > 0 && inStockItems.length > 0) {
      calculateShippingForState();
    } else {
      setShippingRate(0);
      setTotalWeight(0);
    }
  }, [formData.state, inStockItems.length]);

  const calculateShippingForState = async () => {
    if (!formData.state.trim() || inStockItems.length === 0) {
      setShippingRate(0);
      setTotalWeight(0);
      return;
    }

    setShippingLoading(true);
    try {
      // Prepare order items for shipping calculation
      const orderItems = inStockItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const result = await calculateOrderShippingMutation.mutateAsync({
        state: formData.state.toUpperCase(),
        orderItems: orderItems
      });
      
      if (result.success && result.data) {
        setShippingRate(result.data.shippingCost || 0);
        setTotalWeight(result.data.totalWeight || 0);
      } else {
        setShippingRate(0);
        setTotalWeight(0);
        toast.error('Failed to calculate shipping');
      }
    } catch (error) {
      setShippingRate(0);
      setTotalWeight(0);
      toast.error('Failed to calculate shipping rate');
    } finally {
      setShippingLoading(false);
    }
  };

  // FIXED: Safe discount calculation (keep your existing function)
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const couponData = appliedCoupon.coupon || appliedCoupon;
    const discountType = couponData.discountType || couponData.type;
    const discountValue = couponData.discountValue || couponData.value;
    const maxDiscount = couponData.maxDiscount;

    if (!discountType || discountValue === undefined || discountValue === null) {
      console.error('Invalid coupon data:', appliedCoupon);
      return 0;
    }

    let discountAmount = 0;

    if (discountType === 'PERCENTAGE' || discountType === 'percentage') {
      discountAmount = (subtotal * Number(discountValue)) / 100;
      if (maxDiscount && discountAmount > maxDiscount) {
        discountAmount = Number(maxDiscount);
      }
    } else {
      discountAmount = Math.min(Number(discountValue), subtotal);
    }

    return Number(discountAmount.toFixed(2));
  };

  const discount = calculateDiscount();
  const total = Number((subtotal + shippingRate - discount).toFixed(2));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle courier selection
  const handleCourierChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferredCourier: value
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const result = await validateCouponMutation.mutateAsync({ 
        code: couponCode, 
        subtotal: subtotal 
      });
      
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Shri Velan Foods',
      description: 'Order Payment',
      order_id: orderData.razorpayOrderId,
      handler: async function (response) {
        try {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: {
              ...formData,
              items: inStockItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
              })),
              subtotal: subtotal,
              shipping: shippingRate,
              discount: discount,
              total: total,
              couponCode: appliedCoupon ? (appliedCoupon.coupon?.code || appliedCoupon.code) : null,
              userId: user.id,
              preferredCourier: formData.preferredCourier, // Include courier preference
              courierInstructions: formData.courierInstructions // Include instructions
            }
          };

          await verifyPaymentMutation.mutateAsync(verificationData);
          
          clearCart();
          navigate('/order-success');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#10B981'
      },
      modal: {
        ondismiss: function() {
          toast.error('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (inStockItems.length === 0) {
      toast.error('Please add items to cart before checkout');
      return;
    }

    // Basic validation
    const requiredFields = ['firstName', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill all required fields');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    // State validation
    if (!formData.state.trim()) {
      toast.error('Please enter your state');
      return;
    }

    setLoading(true);

    try {
      if (formData.paymentMethod === 'card' || formData.paymentMethod === 'upi') {
        const orderData = {
          items: inStockItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          state: formData.state,
          couponCode: appliedCoupon ? (appliedCoupon.coupon?.code || appliedCoupon.code) : null,
          userId: user.id,
          shipping: shippingRate,
          subtotal: subtotal,
          discount: discount,
          total: total,
          preferredCourier: formData.preferredCourier, // Include courier preference
          courierInstructions: formData.courierInstructions // Include instructions
        };

        const result = await createRazorpayOrderMutation.mutateAsync(orderData);
        
        if (result.data) {
          await handleRazorpayPayment({
            ...result.data,
            razorpayOrderId: result.data.razorpayOrderId
          });
        } else {
          throw new Error('No order data received from server');
        }
      } else if (formData.paymentMethod === 'cod') {
        const orderData = {
          ...formData,
          items: inStockItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          subtotal: subtotal,
          shipping: shippingRate,
          discount: discount,
          total: total,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          userId: user.id,
          paymentMethod: 'cod',
          preferredCourier: formData.preferredCourier, // Include courier preference
          courierInstructions: formData.courierInstructions // Include instructions
        };

        await verifyPaymentMutation.mutateAsync({
          orderData: orderData,
          isCOD: true
        });
        
        clearCart();
        toast.success('Order placed successfully! Cash on Delivery selected.');
        navigate('/order-success');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to access checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
  }, [user, navigate]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTruck className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add some organic goodies to your cart before proceeding to checkout!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
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
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            {/* Left Side (Back + Title) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm sm:text-base">Back to Cart</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
            </div>

            {/* Right Side (Secure Checkout) */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderLock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
                  <span>Shipping Information</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        maxLength="10"
                        pattern="[6-9]{1}[0-9]{9}"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter your state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        maxLength="6"
                        pattern="[0-9]{6}"
                      />
                    </div>
                  </div>

                  {/* Courier Preference Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaShippingFast className="w-5 h-5 text-green-600" />
                      <span>Courier Preference (Optional)</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Courier Service
                        </label>
                        <select
                          name="preferredCourier"
                          value={formData.preferredCourier}
                          onChange={handleCourierChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select a courier service (Optional)</option>
                          {courierOptions.map((courier) => (
                            <option key={courier.value} value={courier.value}>
                              {courier.label} - {courier.description}
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          We'll try to use your preferred courier, but availability may vary by location
                        </p>
                      </div>

                      {formData.preferredCourier && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Instructions for Courier (Optional)
                          </label>
                          <textarea
                            name="courierInstructions"
                            value={formData.courierInstructions}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="e.g., Leave at security, Call before delivery, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Rate Display */}
                  {formData.state && inStockItems.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FaTruck className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Shipping to {formData.state}</span>
                          </div>
                          {totalWeight > 0 && (
                            <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                              <FaWeightHanging className="w-3 h-3" />
                              <span>Total Weight: {totalWeight}kg</span>
                            </div>
                          )}
                          {shippingLoading ? (
                            <p className="text-sm text-blue-600">Calculating shipping...</p>
                          ) : (
                            <p className="text-sm text-blue-600">
                              Shipping rate: <span className="font-semibold">₹{shippingRate}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaTag className="w-5 h-5 text-green-600" />
                  <span>Apply Coupon</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!!appliedCoupon}
                  />

                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>

                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Coupon applied: {appliedCoupon.coupon?.code || appliedCoupon.code}
                    </p>
                    <p className="text-green-600 text-sm">
                      {appliedCoupon.coupon?.description || appliedCoupon.description}
                    </p>
                    <p className="text-green-700 font-semibold">
                      Discount:{' '}
                      {((appliedCoupon.coupon?.discountType === 'PERCENTAGE' || appliedCoupon.coupon?.type === 'percentage' || appliedCoupon.discountType === 'PERCENTAGE' || appliedCoupon.type === 'percentage')
                        ? `${appliedCoupon.coupon?.discountValue || appliedCoupon.coupon?.value || appliedCoupon.discountValue || appliedCoupon.value}% (₹${discount.toFixed(2)})`
                        : `₹${appliedCoupon.coupon?.discountValue || appliedCoupon.coupon?.value || appliedCoupon.discountValue || appliedCoupon.value}`
                      )}
                    </p>
                  </div>
                )}

                {/* Show available coupons in checkout too */}
                {availableCoupons.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Available coupons:</p>
                    <div className="space-y-2">
                      {availableCoupons.map((coupon) => (
                        <div key={coupon.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span className="font-medium">{coupon.code}</span>
                          <span>
                            {coupon.discountType === 'PERCENTAGE' 
                              ? `${coupon.discountValue}% OFF` 
                              : `₹${coupon.discountValue} OFF`
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <FaCreditCard className="w-5 h-5 text-green-600" />
                  <span>Payment Method</span>
                </h2>

                <div className="space-y-4">
                  {[
                    { id: 'card', name: 'Credit/Debit Card', icon: FaCreditCard, description: 'Pay securely with your card' },
                    { id: 'upi', name: 'UPI Payment', icon: FaWallet, description: 'Pay using any UPI app' },
                  ].map((method) => (
                    <label key={method.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <method.icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {inStockItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.offerPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({inStockItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingLoading ? (
                        <span className="text-sm text-gray-500">Calculating...</span>
                      ) : (
                        `₹${shippingRate}`
                      )}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        {shippingLoading ? (
                          <span className="text-sm text-gray-500">Calculating...</span>
                        ) : (
                          `₹${total.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Courier Preference Display in Summary */}
                {formData.preferredCourier && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaShippingFast className="w-4 h-4" />
                      <span className="text-sm font-medium">Preferred Courier</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {courierOptions.find(c => c.value === formData.preferredCourier)?.label}
                    </p>
                  </div>
                )}

                {/* Shipping Info */}
                {!shippingLoading && shippingRate > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaTruck className="w-4 h-4" />
                      <span className="text-sm font-medium">Shipping Calculated</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on {totalWeight}kg weight and {formData.state}
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || inStockItems.length === 0 || shippingLoading || !formData.state}
                  className={`w-full mt-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    loading || inStockItems.length === 0 || shippingLoading || !formData.state
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaLock className="w-5 h-5" />
                      <span>
                        {formData.paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toFixed(2)}`}
                      </span>
                    </>
                  )}
                </button>

                {!formData.state && (
                  <p className="text-sm text-orange-600 text-center mt-3">
                    Please enter your state to calculate shipping
                  </p>
                )}

                {inStockItems.length === 0 && (
                  <p className="text-sm text-orange-600 text-center mt-3">
                    No available items to checkout
                  </p>
                )}

                {/* Security Badges */}
                <div className="mt-6 space-y-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>256-bit SSL secured checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Your data is always protected</span>
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

export default Checkout;