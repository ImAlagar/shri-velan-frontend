// src/pages/general/ProductDetails.js - UPDATED WITH PREPARING METHODS
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import noProduct from '../../assets/Error.json';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  ArrowLeft, 
  Check, 
  Minus,
  Plus,
  Leaf,
  Weight,
  Tag,
  Package,
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  ChefHat // ✅ ADD CHEF HAT ICON FOR PREPARING METHODS
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import RelatedProducts from './RelatedProducts';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useProduct } from '../../hooks/useProducts';
import { 
  useProductRatings, 
  useUserProductRating, 
  useCreateRating,
  useProductRatingStats 
} from '../../hooks/useRatings';
import Loader from '../../components/Loader/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Review state
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
    title: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Use the product hook
  const { data: productData, isLoading: productLoading, error } = useProduct(id);
  
  // Use rating hooks
  const { data: ratingsData, isLoading: ratingsLoading } = useProductRatings(id);
  const { data: userRatingData } = useUserProductRating(user?.id, id);
  const { data: ratingStats } = useProductRatingStats(id);
  const createRatingMutation = useCreateRating();

  // Get product from location state OR from API response
  const product = location.state?.product || productData?.data?.product || productData?.data;

  // Initialize quantity from cart if product is already in cart
  useEffect(() => {
    if (product && cartItems) {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    }
  }, [product, cartItems]);

  // Initialize user's existing rating
  useEffect(() => {
    if (userRatingData?.data) {
      setReview({
        rating: userRatingData.data.rating,
        comment: userRatingData.data.review || '',
        title: userRatingData.data.title || ''
      });
    }
  }, [userRatingData]);

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(value, product.stock || 1));
    setQuantity(newQty);
    
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem) {
      updateQuantity(product.id, newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      await addToCart({ ...product, quantity });
      toast.success(
        <div className="flex items-center gap-3">
          <Check className="text-green-500 text-lg" />
          <div>
            <p className="font-semibold">Added to Cart!</p>
            <p className="text-sm text-gray-600">{product.name} × {quantity}</p>
          </div>
        </div>
      );
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from Shri Velan Organic Foods`,
          url: window.location.href,
        });
        toast.success('Product shared successfully!');
      } catch (error) {
        return error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/400/400';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Review handlers
  const handleRatingChange = (newRating) => {
    setReview(prev => ({ ...prev, rating: newRating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!review.rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!review.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await createRatingMutation.mutateAsync({
        productId: id,
        rating: review.rating,
        comment: review.comment,
        title: review.title,
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      });

      // Reset form
      setReview({
        rating: 0,
        comment: '',
        title: ''
      });
      
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  // Get ratings data
  const ratings = ratingsData?.data || [];
  const stats = ratingStats?.data || {
    averageRating: 0,
    totalRatings: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
  const userRating = userRatingData?.data;

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen text-center px-5"
      >
        <Lottie animationData={noProduct} loop={true} className="w-72 mb-6" />
        <p className="text-primary font-SpaceGrotesk tracking-wide text-lg font-medium mb-4">
          Product not found
        </p>
        <motion.button
          onClick={() => navigate('/products')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          Back to Products
        </motion.button>
      </motion.div>
    );
  }

  // Get product images safely
  const productImages = product.images || (product.image ? [product.image] : ['/api/placeholder/600/600']);
  const discount = product.normalPrice > (product.offerPrice || 0) 
    ? Math.round(((product.normalPrice - (product.offerPrice || 0)) / product.normalPrice) * 100)
    : 0;

  // Calculate average rating from product data if stats are not available
  const averageRating = stats.averageRating || product.rating || 0;
  const totalRatings = stats.totalRatings || ratings.length;

  // ✅ Get preparing methods
  const preparingMethods = product.preparingMethods || [];

  return (
    <section className="min-h-screen bg-gray-50 font-SpaceGrotesk">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <ChevronRight size={16} />
            <button 
              onClick={() => navigate('/products')}
              className="hover:text-primary transition-colors"
            >
              Products
            </button>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <motion.div 
                className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group"
                variants={imageVariants}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <motion.div 
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md"
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {discount}% OFF
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                      (product.stock || 0) > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </motion.div>
                </div>

                {/* Organic Badge */}
                <motion.div 
                  className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Leaf size={14} />
                  Organic
                </motion.div>
              </motion.div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <motion.div 
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                  variants={itemVariants}
                >
                  {productImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-primary shadow-md scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6 w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">

              {/* Header Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  
                  {/* Product Info */}
                  <div className="space-y-3 flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight break-words">
                      {product.name}
                    </h1>

                    {/* Category and Weight */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      {product.category && (
                        <span className="flex items-center gap-1 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                          <Tag size={14} />
                          {product.category.name}
                        </span>
                      )}
                      {product.weight && (
                        <span className="flex items-center gap-1 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                          <Weight size={14} />
                          {product.weight < 1000
                            ? `${product.weight} g`
                            : `${(product.weight / 1000).toFixed(product.weight % 1000 === 0 ? 0 : 1)} kg`}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50 px-2 sm:px-3 py-1 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.floor(averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 self-start sm:self-center">
                    <motion.button
                      onClick={handleShare}
                      className="p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition-all duration-300"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Share2 size={18} className="sm:size-20 lg:size-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Price Section */}
              <motion.div variants={itemVariants} className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {(() => {
                    const hasOfferPrice = product.offerPrice && product.offerPrice > 0;
                    const hasNormalPrice = product.normalPrice && product.normalPrice > 0;
                    let currentPrice, originalPrice, hasDiscount;

                    if (hasOfferPrice && hasNormalPrice) {
                      if (product.offerPrice < product.normalPrice) {
                        currentPrice = product.offerPrice;
                        originalPrice = product.normalPrice;
                        hasDiscount = true;
                      } else {
                        currentPrice = product.normalPrice;
                        originalPrice = product.offerPrice;
                        hasDiscount = true;
                      }
                    } else if (hasOfferPrice) {
                      currentPrice = product.offerPrice;
                      originalPrice = null;
                      hasDiscount = false;
                    } else if (hasNormalPrice) {
                      currentPrice = product.normalPrice;
                      originalPrice = null;
                      hasDiscount = false;
                    } else {
                      currentPrice = product.price || 0;
                      originalPrice = null;
                      hasDiscount = false;
                    }

                    return (
                      <>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                          ₹{currentPrice}
                        </span>
                        {hasDiscount && originalPrice && (
                          <>
                            <span className="text-lg sm:text-xl text-gray-400 line-through">
                              ₹{originalPrice}
                            </span>
                            <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                              {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>

              {/* Quantity Selector */}
              {(product.stock || 0) > 0 && (
                <motion.div variants={itemVariants} className="space-y-3 pt-4 border-t">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Quantity</h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {product.stock} available
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <motion.button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-gray-600"
                      whileHover={{ scale: quantity > 1 ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus size={14} />
                    </motion.button>

                    <motion.input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="w-16 sm:w-20 text-center border border-gray-300 rounded-lg py-2 sm:py-3 px-3 font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      whileFocus={{ scale: 1.02 }}
                    />

                    <motion.button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-gray-600"
                      whileHover={{ scale: quantity < product.stock ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-6">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0 || isLoading}
                  className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-primary hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ShoppingCart size={18} />
                  {isLoading ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    'Add to Cart'
                  )}
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  disabled={(product.stock || 0) === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Buy Now
                </motion.button>
              </motion.div>

              {/* Additional Info */}
              <motion.div variants={itemVariants} className="border-t pt-6 space-y-3 text-xs sm:text-sm md:text-base">
                {product.isCombo && (
                  <div className="flex justify-between flex-wrap">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-orange-500">Combo Pack</span>
                  </div>
                )}
              </motion.div>
            </div>

          </div>

          {/* Tabs Section - UPDATED WITH PREPARING METHODS TAB */}
          <motion.div variants={itemVariants} className="border-t border-gray-200">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'description', label: 'Description', icon: null },
                { id: 'benefits', label: 'Benefits', icon: <Check size={16} /> },
                { id: 'ingredients', label: 'Ingredients', icon: <Package size={16} /> },
                { id: 'preparing', label: 'Method', icon: <ChefHat size={16} /> }, // ✅ ADD PREPARING METHODS TAB
                { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={16} />, count: totalRatings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 flex-1 min-w-max py-4 px-6 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-blue-50/50'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Existing tabs */}
                {activeTab === 'description' && product.description && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    {product.description}
                  </motion.div>
                )}
                
                {activeTab === 'benefits' && product.benefits && product.benefits.length > 0 && (
                  <motion.ul
                    key="benefits"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {product.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="text-green-500 flex-shrink-0" size={16} />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {activeTab === 'ingredients' && product.ingredients && product.ingredients.length > 0 && (
                  <motion.ul
                    key="ingredients"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {product.ingredients.map((ingredient, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Package className="text-blue-500 flex-shrink-0" size={16} />
                        <span>{ingredient}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {/* ✅ NEW PREPARING METHODS TAB */}
                {activeTab === 'preparing' && (
                  <motion.div
                    key="preparing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {preparingMethods.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-orange-100 rounded-full">
                            <ChefHat className="text-orange-600" size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Preparation Methods</h3>
                            <p className="text-gray-600">Follow these steps for best results</p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {preparingMethods.map((method, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-sm transition-shadow duration-300"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 leading-relaxed flex-1">
                                {method}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Tips Section */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="text-blue-500" size={18} />
                            <h4 className="font-semibold text-blue-900">Tips for Best Results</h4>
                          </div>
                          <ul className="text-blue-800 text-sm space-y-1">
                            <li>• Use fresh, clean water for preparation</li>
                            <li>• Follow the measurements accurately</li>
                            <li>• Store in airtight containers after opening</li>
                            <li>• Consume within recommended time</li>
                          </ul>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg"
                      >
                        <ChefHat size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No preparation methods available</p>
                        <p className="text-sm">Preparation instructions will be added soon</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Rating Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Overall Rating */}
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={20}
                              className={`${
                                star <= Math.round(averageRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">
                          Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                        </p>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = stats.ratingBreakdown?.[rating] || 0;
                          const percentage = totalRatings ? (count / totalRatings) * 100 : 0;
                          
                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-16">
                                <span className="text-sm text-gray-600">{rating}</span>
                                <Star size={14} className="text-yellow-400 fill-current" />
                              </div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Review Form */}
                    {user ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {userRating ? 'Update Your Review' : 'Write a Review'}
                        </h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          {/* Rating Stars */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Rating *
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleRatingChange(star)}
                                  onMouseEnter={() => setHoveredStar(star)}
                                  onMouseLeave={() => setHoveredStar(0)}
                                  className="p-1 transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={32}
                                    className={`${
                                      star <= (hoveredStar || review.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Review Title */}
                          <div>
                            <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
                              Review Title (Optional)
                            </label>
                            <input
                              type="text"
                              id="reviewTitle"
                              value={review.title}
                              onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              placeholder="Summarize your experience"
                            />
                          </div>

                          {/* Review Comment */}
                          <div>
                            <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-2">
                              Your Review *
                            </label>
                            <textarea
                              id="reviewComment"
                              value={review.comment}
                              onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              placeholder="Share your experience with this product..."
                              required
                            />
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isSubmittingReview || !review.rating || !review.comment}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ThumbsUp size={18} />
                            {isSubmittingReview ? 'Submitting...' : userRating ? 'Update Review' : 'Submit Review'}
                          </motion.button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
                      >
                        <MessageSquare size={32} className="mx-auto mb-3 text-yellow-600" />
                        <p className="text-yellow-800 mb-4 font-medium">
                          Please login to submit a review
                        </p>
                        <motion.button
                          onClick={() => navigate('/login', { state: { from: location.pathname } })}
                          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Login to Review
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Customer Reviews ({ratings.length})
                      </h3>
                      
                      {ratingsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : ratings.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg"
                        >
                          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium text-gray-600 mb-2">No reviews yet</p>
                          <p className="text-sm">Be the first to review this product!</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {/* Show first 3 reviews initially, then all when expanded */}
                          {ratings.slice(0, showAllReviews ? ratings.length : 3).map((rating, index) => (
                            <motion.div
                              key={rating.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-300"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <User size={16} className="text-gray-400" />
                                    <span className="font-semibold text-gray-900">
                                      {rating.userName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={14}
                                          className={`${
                                            star <= rating.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span>
                                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {rating.title && (
                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                                  {rating.title}
                                </h4>
                              )}
                              
                              <p className="text-gray-700 leading-relaxed">
                                {rating.review}
                              </p>
                            </motion.div>
                          ))}
                          
                          {/* Show More/Less Button - Only show if there are more than 3 reviews */}
                          {ratings.length > 3 && (
                            <div className="flex justify-center pt-4">
                              <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                              >
                                {showAllReviews ? (
                                  <>
                                    <ChevronUp size={16} />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={16} />
                                    Show More ({ratings.length - 3} more reviews)
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} categoryId={product.category?.id} />
      </div>
    </section>
  );
};

export default ProductDetails;