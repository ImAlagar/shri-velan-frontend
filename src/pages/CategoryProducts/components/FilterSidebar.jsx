// src/pages/CategoryProducts/components/FilterSidebar.js
import React from "react";
import { motion } from "framer-motion";

const FilterSidebar = ({ filters, setFilters, onClose }) => {
  const priceMarks = {
    0: '₹0',
    250: '₹250',
    500: '₹500',
    750: '₹750',
    1000: '₹1000+'
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const handleRatingToggle = (rating) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter(r => r !== rating)
      : [...filters.ratings, rating];
    setFilters({ ...filters, ratings: newRatings });
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      inStock: false,
      onSale: false,
      ratings: [],
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Special Offers */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Special Offers</h4>
        <div className="space-y-2">
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
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Customer Ratings</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingToggle(rating)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
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

      {/* Active Filters */}
      {(filters.inStock || filters.onSale || filters.ratings.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
        <div className="pt-4 border-t border-gray-200">
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
            {filters.ratings.map(rating => (
              <span key={rating} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {rating} Stars & Up
                <button
                  onClick={() => handleRatingToggle(rating)}
                  className="ml-1 hover:text-yellow-900"
                >
                  ×
                </button>
              </span>
            ))}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                <button
                  onClick={() => setFilters({ ...filters, priceRange: [0, 1000] })}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FilterSidebar;