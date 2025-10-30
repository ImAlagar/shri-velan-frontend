// components/admin/stats/CategoryStats.jsx
import React from 'react';
import { FiFolder, FiPackage, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';
import { useCategoryStats } from '../../../hooks/useCategories';

const CategoryStats = () => {
  const { data: stats, isLoading, error } = useCategoryStats();

  if (isLoading) {
    return (
      <StatsGrid>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </StatsGrid>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <FiXCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-800">Failed to load category statistics</span>
        </div>
      </div>
    );
  }

  if (!stats?.data) {
    return null;
  }

  const categoryStatsData = [
    {
      title: "Total Categories",
      value: stats.data.totalCategories,
      change: 8, // You can calculate this based on previous data
      icon: FiFolder,
      color: "blue",
      description: "In catalog",
      trend: "up"
    },
    {
      title: "Active Categories",
      value: stats.data.activeCategories,
      change: parseFloat(stats.data.activePercentage),
      icon: FiCheckCircle,
      color: "green",
      description: `${stats.data.activePercentage}% of total`,
      trend: "up"
    },
    {
      title: "Inactive Categories",
      value: stats.data.inactiveCategories,
      change: parseFloat(stats.data.inactivePercentage),
      icon: FiXCircle,
      color: "red",
      description: `${stats.data.inactivePercentage}% of total`,
      alert: stats.data.inactiveCategories > 0 ? "Categories disabled" : null,
      trend: "down"
    },
    {
      title: "Total Products",
      value: stats.data.totalProducts,
      change: 15, // Calculate based on previous data
      icon: FiPackage,
      color: "purple",
      description: "Across all categories",
      trend: "up"
    }
  ];

  return (
    <div>
      <StatsGrid>
        {categoryStatsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </StatsGrid>
      
      {/* Additional Stats */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
  {/* 🥇 Top Categories by Products */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <FiTrendingUp className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
      <span className="truncate">Top Categories by Products</span>
    </h3>

    <div className="space-y-3">
      {stats.data.topCategories?.map((category, index) => (
        <div
          key={category.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition"
        >
          {/* Left: Rank & Name */}
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
              {category.name}
            </span>
          </div>

          {/* Right: Product count & status */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 text-sm">
            <span className="text-gray-600">{category.productCount} products</span>
            <span
              className={`inline-flex px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                category.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {category.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* 📊 Performance Overview */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
      Performance Overview
    </h3>

    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <span className="text-sm text-gray-600">Average Products per Category</span>
        <span className="text-lg font-semibold text-gray-900 mt-1 sm:mt-0">
          {stats.data.averageProducts}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <span className="text-sm text-gray-600">Recently Added (30 days)</span>
        <span className="text-lg font-semibold text-gray-900 mt-1 sm:mt-0">
          {stats.data.recentCategories}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <span className="text-sm text-gray-600">Active Rate</span>
        <span className="text-lg font-semibold text-green-600 mt-1 sm:mt-0">
          {stats.data.activePercentage}%
        </span>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default CategoryStats;