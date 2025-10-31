// src/pages/Categories/Categories.js
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useActiveCategories } from "../../hooks/useCategories";

const Categories = () => {
  const { data: categoriesResponse, isLoading, isError } = useActiveCategories();
  const categories = categoriesResponse?.data || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load categories</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop By Category</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of organic products carefully categorized to help you find exactly what you need for a healthy lifestyle.
          </p>
        </motion.div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">No categories available at the moment.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center cursor-pointer border border-gray-100 group-hover:border-primary/20">
                    {/* Image Container */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-50">
                      <img
                        src={category.image || "/placeholder.jpg"}
                        alt={category.name}
                        className="object-contain w-full h-full p-2 transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Category Name */}
                    <h3 className="text-sm font-semibold text-gray-800 text-center group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {category.name}
                    </h3>

                    {/* View Products Text */}
                    <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;