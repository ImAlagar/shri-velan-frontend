import React, { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import noProducts from "../../assets/Error.json";
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
  const { data: productsData, isLoading, error: queryError } = useProducts();
  
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
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const categories = categoriesResponse?.data || [];

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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

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
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {products.length !== filteredProducts.length && 
                  ` (from ${products.length} total)`
                }
              </p>
            </div>

            {/* Right Side - Sort + Filters */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* Filter Button (mobile only) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 hover:bg-gray-50 text-sm lg:hidden"
              >
                <span>Filters</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
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
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.category === category.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{category.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full min-w-8 text-center ${
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setFilters({
                        priceRange: [0, 1000],
                        inStock: false,
                        onSale: false,
                        ratings: [],
                        category: "all"
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
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {products.length === 0 
                    ? "No products available at the moment" 
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 1000],
                    inStock: false,
                    onSale: false,
                    ratings: [],
                    category: "all"
                  })}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
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