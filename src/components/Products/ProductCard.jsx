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
  
  // Find if product is in cart and get quantity
  const cartItem = cartItems.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, value);
    setQuantity(newQty);

    // If already in cart, update quantity
    if (cartItem) {
      updateQuantity(product.id, newQty);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart({ ...product, quantity });
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  // Handle card click - navigate to product details
  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or quantity controls
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    navigate(`/product-details/${product.id}`, { 
      state: { product } 
    });
  };

  // Get product image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return "/images/placeholder-product.jpg";
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (product.rating) {
      return product.rating;
    }
    if (product.ratings && product.ratings.length > 0) {
      const total = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      return total / product.ratings.length;
    }
    return 0;
  };

  // Get rating count
  const getRatingCount = () => {
    if (product.ratingCount) {
      return product.ratingCount;
    }
    if (product.ratings) {
      return product.ratings.length;
    }
    return 0;
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    
    return stars;
  };

  const productImage = getProductImage();
  const isOutOfStock = product.stock === 0;
  const averageRating = getAverageRating();
  const ratingCount = getRatingCount();
  const hasRatings = averageRating > 0;

  // Price calculation logic
  const calculatePriceDisplay = () => {

    const hasOfferPrice = product.offerPrice && product.offerPrice > 0;
    const hasNormalPrice = product.normalPrice && product.normalPrice > 0;
    
    let currentPrice, originalPrice, hasDiscount;
    
    if (hasOfferPrice && hasNormalPrice) {
      // Check which price is actually the discounted price
      if (product.offerPrice < product.normalPrice) {
        // Normal case: offerPrice is discounted price
        currentPrice = product.offerPrice;
        originalPrice = product.normalPrice;
        hasDiscount = true;
      } else {
        // Reverse case: normalPrice is actually the discounted price
        currentPrice = product.normalPrice;
        originalPrice = product.offerPrice;
        hasDiscount = true;
      }
    } else if (hasOfferPrice) {
      // Only offer price exists
      currentPrice = product.offerPrice;
      originalPrice = null;
      hasDiscount = false;
    } else if (hasNormalPrice) {
      // Only normal price exists
      currentPrice = product.normalPrice;
      originalPrice = null;
      hasDiscount = false;
    } else {
      // Fallback to price field
      currentPrice = product.price;
      originalPrice = null;
      hasDiscount = false;
    }

    console.log('Final display:', { currentPrice, originalPrice, hasDiscount });
    
    return { currentPrice, originalPrice, hasDiscount };
  };

  const { currentPrice, originalPrice, hasDiscount } = calculatePriceDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="bg-white cursor-pointer text-black p-5 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Image with hover effect */}
      <div className="relative group mb-4">
        <img
          src={productImage}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-md transition-all duration-300 group-hover:opacity-90"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.jpg";
          }}
        />
        
        {/* Hover Add to Cart Button */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-primary flex items-center gap-3 font-SpaceGrotesk tracking-wider hover:bg-green-700 text-white p-3 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaOpencart size={22} /> 
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        )}

        {/* Rating Badge on Image */}
        {hasRatings && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-gray-800">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <h2 className="text-xl font-semibold mb-1 line-clamp-2">{product.name}</h2>
      
      {product.weight && (
        <span className="text-sm text-gray-600 mb-2">{product.weight}g</span>
      )}

      {/* Rating Section */}
      {hasRatings && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {renderStarRating(averageRating)}
          </div>
          <span className="text-sm text-gray-600">
            ({averageRating.toFixed(1)})
          </span>
          <span className="text-sm text-gray-500">
            {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      )}

      {/* No Ratings Message */}
      {!hasRatings && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaRegStar key={star} className="text-gray-300" />
            ))}
          </div>
          <span className="text-sm text-gray-500">No reviews yet</span>
        </div>
      )}

      {/* Price Display */}
      <div className="mb-3">
        <span className="text-primary font-bold mr-2 text-xl">
          ₹{currentPrice}
        </span>
        {hasDiscount && originalPrice && (
          <>
            <span className="text-gray-400 line-through text-lg">
              ₹{originalPrice}
            </span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <p className={`${isOutOfStock ? "text-red-400" : "text-green-400"} font-medium mb-4`}>
        {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock} left)`}
      </p>

      {/* Quantity Controls - Only show if in stock */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(quantity - 1);
            }}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            className="w-14 text-center border rounded px-1 py-1"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            min="1"
            max={product.stock}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(quantity + 1);
            }}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Mobile Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-md mt-auto font-medium transition-all ${
          isOutOfStock
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-green-700 text-white"
        }`}
      >
        <FaOpencart size={18} />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>

      {/* Mobile View Details Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/product-details/${product.id}`, { state: { product } });
        }}
        className="lg:hidden flex px-4 py-2 rounded-md justify-center mt-2 font-medium transition-all bg-gray-200 hover:bg-gray-300 text-gray-800"
      >
        View Details
      </button>
    </motion.div>
  );
};

export default ProductCard;