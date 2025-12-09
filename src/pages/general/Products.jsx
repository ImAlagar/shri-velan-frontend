import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { CartContext } from "../../contexts/CartContext";
import { useProducts } from "../../hooks/useProducts";
import { useActiveCategories } from "../../hooks/useCategories";
import ProductCard from "../../components/Products/ProductCard";

const Products = () => {
  const { addToCart, updateQuantity, cartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Use the useProducts hook
  const { data: productsData, isLoading, error: queryError } = useProducts({limit:1000});
  
  // Get categories for sidebar
  const { data: categoriesResponse } = useActiveCategories();

  // State for filters and pagination
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    inStock: false,
    onSale: false,
    ratings: [],
    category: "all"
  });
  
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  const categories = categoriesResponse?.data || [];

  // Calculate applied filters count
  React.useEffect(() => {
    let count = 0;
    if (filters.priceRange[1] < 1000) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.ratings.length > 0) count++;
    if (filters.category !== "all") count++;
    setAppliedFiltersCount(count);
  }, [filters]);

  // Reset to first page when filters or sort change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  useEffect(() => {
    if (productsData) {
      try {
        if (productsData.success) {
          // Filter out combo products (show only regular products)
          const regularProducts = productsData.data.products.filter((item) => item.isCombo !== true);
          setProducts(regularProducts);

          // Initialize quantities
          const initialQuantities = {};
          regularProducts.forEach((item) => {
            const cartItem = cartItems.find((c) => c.id === item.id);
            initialQuantities[item.id] = cartItem ? cartItem.quantity : 1;
          });
          setQuantities(initialQuantities);
        } else {
          setError(productsData.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while processing products.");
      } finally {
        setLoading(false);
      }
    }
  }, [productsData, cartItems]);

  useEffect(() => {
    if (queryError) {
      setError("Something went wrong while fetching products.");
      setLoading(false);
    }
  }, [queryError]);

  useEffect(() => {
    if (!isLoading && productsData) {
      setLoading(false);
    }
  }, [isLoading, productsData]);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const newQty = Math.max(1, value);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));

    const inCart = cartItems.find((c) => c.id === id);
    if (inCart) updateQuantity(id, newQty);
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  const gotoProductDetails = (product) => {
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    if (!products.length) return [];

    let filtered = [...products];

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(product => product.categoryId === filters.category);
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.offerPrice || product.normalPrice || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => 
        product.offerPrice && product.normalPrice && product.offerPrice < product.normalPrice
      );
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
        filtered.sort((a, b) => (a.offerPrice || a.normalPrice || 0) - (b.offerPrice || b.normalPrice || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.offerPrice || b.normalPrice || 0) - (a.offerPrice || a.normalPrice || 0));
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
  }, [products, filters, sortBy]);

  // Pagination calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  // Get current page products
  const currentProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Generate page numbers for pagination
  const pageNumbers = React.useMemo(() => {
    const maxPagesToShow = 5;
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Calculate product counts for categories
  const categoriesWithCounts = React.useMemo(() => {
    const allCategories = categories.map(category => ({
      ...category,
      productCount: products.filter(product => product.categoryId === category.id).length
    }));

    // Add "All Categories" option
    return [
      { id: "all", name: "All Categories", productCount: products.length },
      ...allCategories
    ];
  }, [categories, products]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      inStock: false,
      onSale: false,
      ratings: [],
      category: "all"
    });
    if (window.innerWidth < 1024) {
      setShowFilterSheet(false);
    }
  };

  // Apply filters and close sheet on mobile
  const applyFilters = () => {
    if (window.innerWidth < 1024) {
      setShowFilterSheet(false);
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle products per page change
  const handleProductsPerPageChange = (value) => {
    setProductsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Mobile Filter Sheet Component
  const MobileFilterSheet = () => (
    <div className="lg:hidden">
      {showFilterSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilterSheet(false)}
          />
          
          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilterSheet(false)}
                    className="p-2 -ml-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    {appliedFiltersCount > 0 && (
                      <p className="text-sm text-gray-500">{appliedFiltersCount} filter{appliedFiltersCount !== 1 ? 's' : ''} applied</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(85vh-140px)] overflow-y-auto px-6 py-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                {categoriesWithCounts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No categories</p>
                ) : (
                  <div className="space-y-2">
                    {categoriesWithCounts.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, category: category.id }));
                        }}
                        className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          filters.category === category.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          filters.category === category.id
                            ? 'bg-white text-primary'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                  <span className="text-primary font-medium">₹0 - ₹{filters.priceRange[1]}</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)]
                    }))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹0</span>
                    <span>₹500</span>
                    <span>₹1000</span>
                  </div>
                </div>
              </div>

              {/* Stock & Sale */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                    <div className="flex items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          filters.inStock 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {filters.inStock && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="ml-3 font-medium text-gray-900">In Stock Only</span>
                      </div>
                    </div>
                    {filters.inStock && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                    <div className="flex items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.onSale}
                          onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          filters.onSale 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {filters.onSale && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="ml-3 font-medium text-gray-900">On Sale</span>
                      </div>
                    </div>
                    {filters.onSale && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </label>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                      <div className="flex items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={filters.ratings.includes(rating)}
                            onChange={(e) => {
                              const newRatings = e.target.checked
                                ? [...filters.ratings, rating]
                                : filters.ratings.filter(r => r !== rating);
                              setFilters(prev => ({ ...prev, ratings: newRatings }));
                            }}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            filters.ratings.includes(rating) 
                              ? 'bg-primary border-primary' 
                              : 'border-gray-300'
                          }`}>
                            {filters.ratings.includes(rating) && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 font-medium text-gray-900">& Up</span>
                        </span>
                      </div>
                      {filters.ratings.includes(rating) && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={applyFilters}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply Filters
                {appliedFiltersCount > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Sheet */}
      <MobileFilterSheet />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <button onClick={() => navigate("/")} className="hover:text-primary">Home</button>
            <span>/</span>
            <span className="text-gray-800">All Products</span>
          </nav>

          {/* Header and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - Title + Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                All Products
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Showing {currentProducts.length} of {totalProducts} product{totalProducts !== 1 ? 's' : ''}
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </div>

            {/* Right Side - Sort + Filters */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Items Per Page Dropdown (Desktop only) */}
              <div className="hidden lg:block relative">
                <select
                  value={productsPerPage}
                  onChange={(e) => handleProductsPerPageChange(e.target.value)}
                  className="w-32 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="8">8 per page</option>
                  <option value="12">12 per page</option>
                  <option value="16">16 per page</option>
                  <option value="24">24 per page</option>
                  <option value="32">32 per page</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-48 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">Sort by: Name A-Z</option>
                  <option value="price-low">Sort by: Price Low to High</option>
                  <option value="price-high">Sort by: Price High to Low</option>
                  <option value="rating">Sort by: Highest Rated</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilterSheet(true)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-sm font-medium lg:hidden relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>

              {/* Desktop Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.586V4z" />
                </svg>
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Always visible on desktop, togglable */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6 sticky top-8">
              {/* Categories Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                
                {categoriesWithCounts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">No categories found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {categoriesWithCounts.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
                        className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                          filters.category === category.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{category.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs min-w-8 text-center ${
                            filters.category === category.id
                              ? 'bg-white text-primary'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {category.productCount}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Section */}
              {products.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <div className="flex items-center gap-2">
                      {appliedFiltersCount > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {appliedFiltersCount} active
                        </span>
                      )}
                      <button
                        onClick={resetFilters}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-primary">
                          ₹0 - ₹{filters.priceRange[1]}
                        </div>
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [0, parseInt(e.target.value)]
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹0</span>
                        <span>₹500</span>
                        <span>₹1000</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filter Chips */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, inStock: !prev.inStock }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filters.inStock
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filters.onSale
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        On Sale
                      </button>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Customer Ratings</h4>
                    <div className="space-y-3">
                      {[4, 3, 2, 1].map(rating => (
                        <label key={rating} className="flex items-center cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={filters.ratings.includes(rating)}
                              onChange={(e) => {
                                const newRatings = e.target.checked
                                  ? [...filters.ratings, rating]
                                  : filters.ratings.filter(r => r !== rating);
                                setFilters(prev => ({ ...prev, ratings: newRatings }));
                              }}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              filters.ratings.includes(rating) 
                                ? 'bg-primary border-primary' 
                                : 'border-gray-300 group-hover:border-primary'
                            }`}>
                              {filters.ratings.includes(rating) && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="ml-3 flex items-center text-gray-700 group-hover:text-gray-900">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 font-medium">& Up</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button for Desktop */}
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Bar - Desktop */}
            {appliedFiltersCount > 0 && (
              <div className="hidden lg:flex items-center gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-sm px-3 py-1.5 rounded-full">
                      {categoriesWithCounts.find(c => c.id === filters.category)?.name || 'Category'}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, category: "all" }))}
                        className="ml-1 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.priceRange[1] < 1000 && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                      Price: ₹0-₹{filters.priceRange[1]}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
                        className="ml-1 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full">
                      In Stock
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                        className="ml-1 hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.onSale && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-sm px-3 py-1.5 rounded-full">
                      On Sale
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, onSale: false }))}
                        className="ml-1 hover:text-red-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.ratings.map(rating => (
                    <span key={rating} className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-sm px-3 py-1.5 rounded-full">
                      {rating}+ Stars
                      <button
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          ratings: prev.ratings.filter(r => r !== rating)
                        }))}
                        className="ml-1 hover:text-yellow-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 ml-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products per page selector (Mobile) */}
            {totalPages > 1 && (
              <div className="lg:hidden flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)}-
                  {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts}
                </div>
                <div className="relative">
                  <select
                    value={productsPerPage}
                    onChange={(e) => handleProductsPerPageChange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="8">8/page</option>
                    <option value="12">12/page</option>
                    <option value="16">16/page</option>
                    <option value="24">24/page</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {products.length === 0 
                    ? "No products available at the moment" 
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={resetFilters}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => navigate("/categories")}
                    className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Browse Categories
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    {/* Desktop Pagination */}
                    <div className="hidden lg:flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)}-
                        {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            currentPage === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {pageNumbers[0] > 1 && (
                            <>
                              <button
                                onClick={() => goToPage(1)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  currentPage === 1
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                1
                              </button>
                              {pageNumbers[0] > 2 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                            </>
                          )}

                          {pageNumbers.map(page => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                currentPage === page
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          {pageNumbers[pageNumbers.length - 1] < totalPages && (
                            <>
                              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => goToPage(totalPages)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  currentPage === totalPages
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            currentPage === totalPages
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Next
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Items per page selector */}
                      <div className="relative">
                        <select
                          value={productsPerPage}
                          onChange={(e) => handleProductsPerPageChange(e.target.value)}
                          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="8">8 per page</option>
                          <option value="12">12 per page</option>
                          <option value="16">16 per page</option>
                          <option value="24">24 per page</option>
                          <option value="32">32 per page</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Pagination */}
                    <div className="lg:hidden">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        {/* Page info */}
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                          </p>
                          <p className="text-xs text-gray-500">
                            Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)}-
                            {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                          </p>
                        </div>

                        {/* Pagination buttons */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                              currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Prev
                          </button>

                          {/* Mobile page numbers */}
                          <div className="flex items-center gap-1">
                            {pageNumbers.map(page => (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                                  currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                              currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Jump to page (mobile) */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-700">Go to:</span>
                          <div className="relative w-20">
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={currentPage}
                              onChange={(e) => {
                                const page = Math.min(Math.max(1, parseInt(e.target.value) || 1), totalPages);
                                goToPage(page);
                              }}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <span className="text-sm text-gray-500">/ {totalPages}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;