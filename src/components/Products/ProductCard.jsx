// src/components/Products/ProductCard.js
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { toast } from "react-hot-toast";
import { FaOpencart, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cartItems } = useContext(CartContext);
  
  const cartItem = cartItems.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQty);

    if (cartItem) {
      updateQuantity(product.id, newQty);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart({ ...product, quantity });
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    navigate(`/product-details/${product.id}`, { 
      state: { product } 
    });
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return "/images/placeholder-product.jpg";
  };

  const getAverageRating = () => {
    if (product.rating) return product.rating;
    if (product.ratings?.length > 0) {
      const total = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      return total / product.ratings.length;
    }
    return 0;
  };

  const getRatingCount = () => {
    return product.ratingCount || product.ratings?.length || 0;
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />);
    }
    
    return stars;
  };

  const calculatePriceDisplay = () => {
    const hasOfferPrice = product.offerPrice > 0;
    const hasNormalPrice = product.normalPrice > 0;
    
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
      currentPrice = product.price;
      originalPrice = null;
      hasDiscount = false;
    }

    return { currentPrice, originalPrice, hasDiscount };
  };

  const productImage = getProductImage();
  const isOutOfStock = product.stock === 0;
  const averageRating = getAverageRating();
  const ratingCount = getRatingCount();
  const hasRatings = averageRating > 0;
  const { currentPrice, originalPrice, hasDiscount } = calculatePriceDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group bg-white cursor-pointer text-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md hover:border-gray-200"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.jpg";
          }}
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium tracking-wide">
            Out of Stock
          </div>
        )}

        {/* Rating Badge */}
        {hasRatings && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-gray-100">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-semibold text-gray-800">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Hover Overlay with Add to Cart */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
          >
            <FaOpencart className="text-green-600" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-2 space-y-3">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-sm text-gray-500 font-medium">
            {product.weight >= 1000 
              ? `${product.weight % 1000 === 0 ? product.weight / 1000 : (product.weight / 1000).toFixed(1)} kg`
              : `${product.weight} g`
            }
          </p>
        )}

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {hasRatings ? renderStarRating(averageRating) : (
              [...Array(5)].map((_, i) => (
                <FaRegStar key={i} className="text-gray-300 text-sm" />
              ))
            )}
          </div>
          <span className="text-sm text-gray-600">
            {hasRatings ? `(${ratingCount})` : "No reviews"}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-2xl font-bold text-green-700">
            ₹{currentPrice}
          </span>
          {hasDiscount && originalPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ₹{originalPrice}
              </span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-semibold">
                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
          {isOutOfStock ? "Out of Stock" : `${product.stock} units available`}
        </p>

        {/* Quantity Controls */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mt-2">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(quantity - 1);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-semibold"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(quantity + 1);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-semibold"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;