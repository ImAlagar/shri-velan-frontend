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

    if (cartItem) updateQuantity(product.id, newQty);
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
    if (e.target.closest("button") || e.target.closest("input")) return;
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  const getProductImage = () => {
    if (product?.images?.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "/images/placeholder-product.jpg";
  };

  const getAverageRating = () => {
    if (product.rating) return product.rating;
    if (product.ratings?.length > 0) {
      const total = product.ratings.reduce((sum, r) => sum + r.rating, 0);
      return total / product.ratings.length;
    }
    return 0;
  };

  const getRatingCount = () => product.ratingCount || product.ratings?.length || 0;

  const renderStarRating = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(<FaStar key={`f-${i}`} className="text-yellow-400 text-sm" />);
    }
    if (half) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    const empty = 5 - stars.length;
    for (let i = 0; i < empty; i++) {
      stars.push(<FaRegStar key={`e-${i}`} className="text-gray-300 text-sm" />);
    }

    return stars;
  };

  const calculatePriceDisplay = () => {
    let currentPrice, originalPrice;
    const offer = product.offerPrice;
    const normal = product.normalPrice;

    if (offer > 0 && normal > 0) {
      if (offer < normal) {
        currentPrice = offer;
        originalPrice = normal;
      } else {
        currentPrice = normal;
        originalPrice = offer;
      }
    } else {
      currentPrice = offer || normal || product.price;
      originalPrice = null;
    }

    return {
      currentPrice,
      originalPrice,
      hasDiscount: originalPrice && originalPrice > currentPrice,
    };
  };

  const productImage = getProductImage();
  const isOutOfStock = product.stock === 0;
  const avgRating = getAverageRating();
  const ratingCount = getRatingCount();
  const { currentPrice, originalPrice, hasDiscount } = calculatePriceDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group bg-white cursor-pointer text-gray-900 
                 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 
                 flex flex-col transition-all duration-300 
                 hover:shadow-md hover:border-gray-200"
    >

      {/* Image Section */}
      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full 
                     h-[180px] sm:h-[220px] md:h-[240px] 
                     rounded-lg object-cover 
                     transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => (e.target.src = "/images/placeholder-product.jpg")}
        />

        {/* Add to Cart Hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm 
                       flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <FaOpencart className="text-green-600" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-1 space-y-2">

        {/* Product Name */}
        <h3 className="text-base sm:text-lg font-semibold leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-sm text-gray-500">
            {product.weight >= 1000
              ? `${(product.weight / 1000).toFixed(1)} kg`
              : `${product.weight} g`}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {avgRating > 0 ? renderStarRating(avgRating) : [...Array(5)].map((_, i) => (
              <FaRegStar key={i} className="text-gray-300 text-sm" />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {avgRating > 0 ? `(${ratingCount})` : "No reviews"}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl sm:text-2xl font-bold text-green-700">
            ₹{currentPrice}
          </span>

          {hasDiscount && (
            <>
              <span className="text-sm sm:text-base text-gray-400 line-through">
                ₹{originalPrice}
              </span>

              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md 
                               text-xs sm:text-sm font-semibold">
                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock */}
        <p
          className={`text-sm font-medium ${
            isOutOfStock ? "text-red-600" : "text-green-600"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : `${product.stock} units available`}
        </p>

        {/* Quantity */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mt-2">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>

            <div className="flex items-center gap-2">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(quantity - 1);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center 
                           bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-10 text-center font-semibold text-gray-900">
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(quantity + 1);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center 
                           bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
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
