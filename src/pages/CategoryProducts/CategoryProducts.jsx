// src/pages/CategoryProducts/CategoryProducts.js - CLEAN VERSION
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useActiveCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/Products/ProductCard";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const { data: categoriesResponse } = useActiveCategories();
  const { data: productsResponse, isLoading, isError } = useProducts();
  
  const categories = categoriesResponse?.data || [];
  
  // Extract products
  let products = [];
  if (productsResponse?.data?.products && Array.isArray(productsResponse.data.products)) {
    products = productsResponse.data.products;
  }
  
  // State for filters
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    inStock: false,
    onSale: false,
    ratings: [],
  });
  
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  // Get current category
  const currentCategory = categories.find(cat => cat.id === categoryId);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    // Filter by category
    let filtered = products.filter(product => product.categoryId === categoryId);

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.offerPrice || product.normalPrice || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => (product.stock || 0) > 0);
    }

    // Apply sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => 
        product.offerPrice && product.offerPrice < product.normalPrice
      );
    }

    // Apply rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(product => 
        filters.ratings.includes(Math.floor(product.ratings || 0))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.offerPrice || a.normalPrice || 0;
          const priceB = b.offerPrice || b.normalPrice || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.offerPrice || a.normalPrice || 0;
          const priceB = b.offerPrice || b.normalPrice || 0;
          return priceB - priceA;
        });
        break;
      case "rating":
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case "name":
      default:
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    return filtered;
  }, [products, categoryId, filters, sortBy]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load products</h2>
          <p className="text-gray-600">Please try again later</p>
          <Link
            to="/categories"
            className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{currentCategory?.name || "Category"}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCategory?.name || "Products"}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <span>Filters</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Other filters */}
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
              </div>

              {/* Active Filters */}
              {(filters.inStock || filters.onSale || filters.priceRange[1] < 1000) && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.inStock && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                        <button
                          onClick={() => setFilters({ ...filters, inStock: false })}
                          className="ml-1 hover:text-green-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.onSale && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        On Sale
                        <button
                          onClick={() => setFilters({ ...filters, onSale: false })}
                          className="ml-1 hover:text-red-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.priceRange[1] < 1000 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Under ₹{filters.priceRange[1]}
                        <button
                          onClick={() => setFilters({ ...filters, priceRange: [0, 1000] })}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 1000],
                      inStock: false,
                      onSale: false,
                      ratings: [],
                    })}
                    className="w-full mt-3 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {products.length === 0 ? "No products available" : "No products in this category"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {products.length === 0 
                    ? "There are no products available in our store at the moment." 
                    : "There are no products assigned to this category yet. Browse other categories to find what you're looking for."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 1000],
                      inStock: false,
                      onSale: false,
                      ratings: [],
                    })}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                  <Link
                    to="/categories"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Browse All Categories
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;