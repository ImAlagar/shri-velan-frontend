// src/components/Products/ProductCard.js - UPDATED WITH CART CONTEXT
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // FIXED: Use correct price fields from your data structure
  const hasDiscount = product.offerPrice && product.normalPrice && product.offerPrice < product.normalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.normalPrice - product.offerPrice) / product.normalPrice) * 100)
    : 0;

  // FIXED: Get image from images array or use placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Fallback to category image or placeholder
    if (product.category && product.category.image) {
      return product.category.image;
    }
    return "/images/placeholder-product.jpg";
  };

  // FIXED: Calculate average rating from ratings array
  const getAverageRating = () => {
    if (!product.ratings || product.ratings.length === 0) return 0;
    const sum = product.ratings.reduce((total, rating) => total + rating, 0);
    return (sum / product.ratings.length).toFixed(1);
  };

  const productImage = getProductImage();
  const averageRating = getAverageRating();
  const isOutOfStock = (product.stock || 0) === 0;
  const isProductInCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Handle Add to Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Prepare product data for cart
      const cartProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        normalPrice: product.normalPrice,
        offerPrice: product.offerPrice,
        price: product.offerPrice || product.normalPrice, // Use offer price if available
        image: productImage,
        stock: product.stock,
        weight: product.weight,
        category: product.category?.name,
        quantity: 1,
        maxQuantity: product.stock || 10 // Limit to available stock
      };

      addToCart(cartProduct);
      
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        position: 'bottom-right'
      });
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Increase Quantity
  const handleIncreaseQuantity = (e) => {
    e.stopPropagation();
    if (cartQuantity < (product.stock || 10)) {
      updateQuantity(product.id, cartQuantity + 1);
      toast.success(`Increased ${product.name} quantity to ${cartQuantity + 1}`);
    } else {
      toast.error(`Maximum quantity reached (${product.stock || 10})`);
    }
  };

  // Handle Decrease Quantity
  const handleDecreaseQuantity = (e) => {
    e.stopPropagation();
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
      toast.success(`Decreased ${product.name} quantity to ${cartQuantity - 1}`);
    } else {
      // Remove from cart if quantity becomes 0
      updateQuantity(product.id, 0);
      toast.success(`${product.name} removed from cart`);
    }
  };

  // Handle card click - pass product data via state
  const handleCardClick = (e) => {
    // If it's the add to cart button or quantity controls, don't navigate
    if (e.target.closest('button') || e.target.closest('.quantity-controls')) {
      return;
    }
    // Navigate to product details with product data
    navigate(`/product-details/${product.id}`, { 
      state: { product } 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.jpg";
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Cart Quantity Badge */}
        {isProductInCart && (
          <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
            {cartQuantity} in cart
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-gray-800 px-3 py-1 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist logic
              console.log("Add to wishlist:", product.id);
              toast.success("Added to wishlist!");
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || "Healthy and nutritious organic product"}
        </p>
        
        {/* Weight */}
        {product.weight && (
          <p className="text-gray-500 text-xs mb-2">Weight: {product.weight}</p>
        )}
        
        {/* Price - FIXED: Use correct price fields */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">₹{product.offerPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.normalPrice}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{product.normalPrice || product.offerPrice || 0}</span>
            )}
          </div>
          
          {/* Rating - FIXED: Use calculated average rating */}
          {product.ratings && product.ratings.length > 0 && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">{averageRating}</span>
            </div>
          )}
        </div>
        
        {/* Cart Controls */}
        {!isOutOfStock && (
          <div className="mt-3">
            {!isProductInCart ? (
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isAddingToCart
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            ) : (
              <div className="quantity-controls flex items-center justify-between bg-gray-100 rounded-lg p-1">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="flex-1 text-center font-semibold text-gray-800">
                  {cartQuantity} in cart
                </span>
                
                <button
                  onClick={handleIncreaseQuantity}
                  disabled={cartQuantity >= (product.stock || 10)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
      </div>
    </motion.div>
  );
};

export default ProductCard;