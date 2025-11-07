// src/pages/general/Categories.js
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useActiveCategories } from "../../hooks/useCategories";
import { 
  Baby, 
  Heart, 
  Leaf, 
  Zap, 
  Sprout,
  Wheat,
  Carrot,
  Milk,
  Apple,
  Egg,
  Coffee,
  Fish,
  Nut,
  ShoppingBasket,
  Utensils,
  CloudRain,
  Sun
} from "lucide-react";
import { GiHoneyJar } from "react-icons/gi";

const Categories = () => {
  const { data: categoriesResponse, isLoading, isError } = useActiveCategories();
  const categories = categoriesResponse?.data || [];

  // Comprehensive icon mapping based on category names and keywords
  const categoryIcons = {
    // Baby & Kids
    'baby': Baby,
    'kids': Baby,
    'child': Baby,
    'infant': Baby,
    
    // Health & Immunity
    'immunity': Heart,
    'health': Heart,
    'wellness': Heart,
    'vitamin': Heart,
    
    // Organic & Natural
    'organic': Leaf,
    'natural': Leaf,
    
    // Energy & Sweeteners
    'energy': Zap,
    'honey': GiHoneyJar,
    'sweet': GiHoneyJar,
    'sugar': GiHoneyJar,
    
    // Vegetables & Greens
    'vegetable': Carrot,
    'vegetables': Carrot,
    'greens': Sprout,
    'leafy': Sprout,
    
    // Grains & Cereals
    'grain': Wheat,
    'grains': Wheat,
    'cereal': Wheat,
    'wheat': Wheat,
    'rice': Wheat,
    'masaia': Wheat,
    'pool': Wheat,
    
    // Dairy
    'dairy': Milk,
    'milk': Milk,
    'cheese': Milk,
    'yogurt': Milk,
    
    // Fruits
    'fruit': Apple,
    'fruits': Apple,
    'apple': Apple,
    
    // Protein
    'egg': Egg,
    'eggs': Egg,
    'protein': Egg,
    
    // Beverages
    'beverage': Coffee,
    'drink': Coffee,
    'coffee': Coffee,
    'tea': Coffee,
    
    // Seafood
    'fish': Fish,
    'seafood': Fish,
    
    // Nuts & Seeds
    'nut': Nut,
    'nuts': Nut,
    'seed': Nut,
    
    // Default fallbacks based on name length
    'default': Leaf,
    'short': ShoppingBasket,
    'medium': Utensils,
    'long': CloudRain
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // First, try to match by keywords in the category name
    const keywords = Object.keys(categoryIcons);
    for (const keyword of keywords) {
      if (name.includes(keyword) && keyword !== 'default' && keyword !== 'short' && keyword !== 'medium' && keyword !== 'long') {
        return categoryIcons[keyword];
      }
    }
    
    // If no keyword matches, choose icon based on name length
    const nameLength = categoryName.length;
    if (nameLength <= 8) return categoryIcons.short || ShoppingBasket;
    if (nameLength <= 15) return categoryIcons.medium || Utensils;
    return categoryIcons.long || CloudRain;
  };

  const getIconSize = (categoryName) => {
    const nameLength = categoryName.length;
    if (nameLength <= 8) return 42;  // Larger icons for short names
    if (nameLength <= 15) return 38; // Medium icons
    return 34; // Smaller icons for long names
  };

  const getCardSize = (categoryName) => {
    const nameLength = categoryName.length;
    if (nameLength <= 8) return "w-24 h-24";   // Compact for short names
    if (nameLength <= 15) return "w-28 h-28";  // Standard size
    return "w-32 h-32"; // Larger for long names
  };

  const getTextSize = (categoryName) => {
    const nameLength = categoryName.length;
    if (nameLength <= 8) return "text-lg font-bold";
    if (nameLength <= 15) return "text-base font-semibold";
    return "text-sm font-medium";
  };

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl aspect-square mb-3 shadow-sm"></div>
                <div className="h-4 bg-white rounded mb-2"></div>
                <div className="h-3 bg-white rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load categories</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 lg:px-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-serif">CATEGORIES</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover our wide range of organic products carefully categorized to help you 
            find exactly what you need for a healthy lifestyle.
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
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
          >
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              const iconSize = getIconSize(category.name);
              const cardSize = getCardSize(category.name);
              const textSize = getTextSize(category.name);
              
              return (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <Link
                    to={`/category/${category.id}`}
                    className="block group text-center"
                  >
                    {/* Icon/Image Container */}
                    <div className={`flex items-center justify-center overflow-hidden  mb-4`}>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="object-contain w-full h-full p-3 transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback Icon - Always rendered but hidden if image exists */}
                      <div className={`flex items-center justify-center w-full h-full ${category.image ? 'hidden' : 'flex'}`}>
                        <IconComponent 
                          size={iconSize} 
                          className="text-green-800 group-hover:text-green-700 transition-colors duration-300" 
                        />
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className={`${textSize} capitalize text-green-800 text-center group-hover:text-green-700 transition-colors duration-300 line-clamp-2 leading-tight px-2`}>
                      {category.name}
                    </h3>

                    {/* View Products Indicator */}
                    <p className="text-xs text-green-800 hover:bg-green-700 font-medium mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Shop Now
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Legend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            All our categories feature certified organic and natural products
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;

