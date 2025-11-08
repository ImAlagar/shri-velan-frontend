import React from 'react';
import { motion } from 'framer-motion';
import { useComboProducts } from '../../hooks/useProducts';
import ProductCard from '../Products/ProductCard'; // Import ProductCard

const ComboDeals = () => {
  // Use the dedicated combo products hook
  const { data: productsResponse, isLoading, error } = useComboProducts({
    limit: 3
  });

  const comboProducts = productsResponse?.data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  // Helper function to determine combo tag based on product data
  const getComboTag = (product, index) => {
    if (index === 1) return "Best Value";
    if (product.isBestSeller) return "Most Popular";
    if (product.onSale) return "Limited Time";
    return null;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-7 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-20 bg-gray-100 rounded mb-4"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-SpaceGrotesk text-gray-900 mb-4">
            Special Combo Deals
          </h2>
          <p className="text-red-500">Failed to load combo deals. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 to-purple-100/30 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-SpaceGrotesk text-gray-900 mb-4">
            Special Combo Deals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get more value with our specially curated combo packs. Perfect for gifting or stocking up!
          </p>
        </motion.div>

        {/* Combo Deals Grid */}
        {comboProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {comboProducts.map((product, index) => {
              const tag = getComboTag(product, index);

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`relative ${
                    index === 1 ? 'transform scale-105 z-10' : ''
                  }`}
                >
                  {/* Popular Tag */}
                  {tag && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        tag === "Most Popular" 
                          ? "bg-red-500 text-white" 
                          : tag === "Best Value"
                          ? "bg-green-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}>
                        {tag}
                      </span>
                    </div>
                  )}

                  {/* Highlight for Best Value */}
                  {index === 1 && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  {/* Use ProductCard component */}
                  <div className={`relative ${
                    index === 1 ? 'border-2 border-primary rounded-2xl' : ''
                  }`}>
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No combo deals available at the moment.</p>
          </div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg inline-flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Free Shipping</span>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">100% Organic</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComboDeals;