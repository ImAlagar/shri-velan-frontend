// src/pages/general/CategoryProducts.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useActiveCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/Products/ProductCard";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  
  // Get ALL categories for the sidebar
  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useActiveCategories();
  
  // Get ALL products to calculate category counts
  const { data: allProductsResponse, isLoading: productsLoading, isError: productsError } = useProducts();
  
  // Get filtered products for the current category
  const { data: filteredProductsResponse, isLoading: filteredLoading } = useProducts({
    category: categoryId // This will filter products by category on the backend
  });

  const categories = categoriesResponse?.data || [];
  const allProducts = allProductsResponse?.data || []; // All products for category counts
  const filteredProducts = filteredProductsResponse?.data || []; // Products for current category

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    inStock: false,
    onSale: false,
    ratings: [],
  });
  
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log("📂 All Categories:", categories);
    console.log("📂 All Products Count:", allProducts.length);
    console.log("📂 Filtered Products Count:", filteredProducts.length);
    console.log("📂 Current Category ID:", categoryId);
  }, [categories, allProducts, filteredProducts, categoryId]);

  const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));

  // Apply frontend filters to the already category-filtered products
  const finalFilteredProducts = React.useMemo(() => {
    if (!filteredProducts.length) return [];

    let filtered = [...filteredProducts];

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }

    // Apply sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.sale_price && product.sale_price < product.price);
    }

    // Apply rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(product => 
        filters.ratings.includes(Math.floor(product.rating || 0))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [filteredProducts, filters, sortBy]);

  // Calculate product counts for each category using ALL products
  const categoriesWithCounts = React.useMemo(() => {
    return categories.map(category => {
      const productCount = allProducts.filter(
        product => product.category_id === category.id
      ).length;
      
      return {
        ...category,
        productCount
      };
    });
  }, [categories, allProducts]);

  const isLoading = categoriesLoading || productsLoading || filteredLoading;
  const isError = categoriesError || productsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load products</h2>
          <p className="text-gray-600">Please try again later</p>
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
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-primary">Categories</Link>
            <span>/</span>
            <span className="text-gray-800">{currentCategory?.name || "Category"}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCategory?.name || "Products"}
              </h1>
              <p className="text-gray-600">
                {finalFilteredProducts.length} product{finalFilteredProducts.length !== 1 ? 's' : ''} found
                {filteredProducts.length !== finalFilteredProducts.length && 
                  ` (from ${filteredProducts.length} total in category)`
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
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
          {/* Sidebar with Categories and Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              {/* Categories Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h3>
                
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : categoriesError ? (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">😞</div>
                    <p className="text-sm text-gray-600">Failed to load categories</p>
                  </div>
                ) : categoriesWithCounts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">No categories found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {categoriesWithCounts.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          parseInt(categoryId) === category.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{category.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full min-w-8 text-center ${
                            parseInt(categoryId) === category.id
                              ? 'bg-white text-primary'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {category.productCount}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 1000],
                      inStock: false,
                      onSale: false,
                      ratings: [],
                    })}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Reset Filters
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Stock & Sale Filters */}
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Sale</span>
                  </label>
                </div>

                {/* Rating Filter */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Ratings</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.ratings.includes(rating)}
                          onChange={(e) => {
                            const newRatings = e.target.checked
                              ? [...filters.ratings, rating]
                              : filters.ratings.filter(r => r !== rating);
                            setFilters({ ...filters, ratings: newRatings });
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1">& Up</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {finalFilteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {filteredProducts.length === 0 
                    ? `No products found in ${currentCategory?.name || 'this category'}`
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 1000],
                    inStock: false,
                    onSale: false,
                    ratings: [],
                  })}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {finalFilteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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