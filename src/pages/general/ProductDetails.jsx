// src/pages/general/ProductDetails.js - UPDATED VERSION
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import noProduct from '../../assets/Error.json';
import { FaOpencart, FaHeart, FaShare, FaStar, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import RelatedProducts from './RelatedProducts';
import { CartContext } from '../../contexts/CartContext';
import { useProduct } from '../../hooks/useProducts';
import Loader from '../../components/Loader/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useContext(CartContext);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use the product hook - this should fetch product by ID
  const { data: productData, isLoading: productLoading, error } = useProduct(id);
  
  // Get product from location state OR from API response
  const product = location.state?.product || productData?.data?.product || productData?.data;

  console.log("🔍 ProductDetails Debug:", {
    productId: id,
    hasLocationState: !!location.state?.product,
    hasProductData: !!productData?.data?.product,
    product: product
  });

  // Initialize quantity from cart if product is already in cart
  useEffect(() => {
    if (product && cartItems) {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    }
  }, [product, cartItems]);

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, value);
    setQuantity(newQty);
    
    // Update cart if product is already in cart
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem) {
      updateQuantity(product.id, newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      addToCart({ ...product, quantity });
      toast.success(`${product.name} (${quantity}) added to cart!`);
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
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
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/400/400';
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    console.log("❌ ProductDetails Error:", { error, product, productData });
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-5">
        <Lottie animationData={noProduct} loop={true} className="w-72 mb-6" />
        <p className="text-primary font-SpaceGrotesk tracking-wide text-lg font-medium mb-4">
          Product not found
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Get product images safely
  const productImages = product.images || (product.image ? [product.image] : ['/api/placeholder/600/600']);

  return (
    <section className="min-h-screen bg-gray-50 font-SpaceGrotesk">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-green-700 transition-colors mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                )}

                {/* Weight */}
                {product.weight && (
                  <p className="text-gray-600 mb-3">{product.weight}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.offerPrice || product.normalPrice || 0}
                  </span>
                  {product.normalPrice > (product.offerPrice || 0) && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.normalPrice}
                    </span>
                  )}
                </div>
                
                {/* Discount Badge */}
                {product.normalPrice > (product.offerPrice || 0) && (
                  <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    Save ₹{product.normalPrice - (product.offerPrice || 0)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`text-lg font-medium ${
                (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(product.stock || 0) > 0 
                  ? `In Stock (${product.stock} available)`
                  : 'Out of Stock'
                }
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features/Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Key Benefits</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              {(product.stock || 0) > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2 px-3"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0 || isLoading}
                  className="flex-1 flex items-center justify-center gap-3 bg-primary hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  <FaOpencart className="w-5 h-5" />
                  {isLoading ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={(product.stock || 0) === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Share product"
                >
                  <FaShare className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                
                {product.category && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category.name}</span>
                  </div>
                )}
                
                {product.isCombo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-primary">Combo Product</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} categoryId={product.category?.id} />
      </div>
    </section>
  );
};

export default ProductDetails;