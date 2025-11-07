// components/admin/stats/RatingStats.jsx
import React from 'react';
import { FiStar, FiCheck, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';
import { useRatings } from '../../../hooks/useRatings';

const RatingStats = () => {
  const { data: ratingsData, isLoading, error } = useRatings();

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
          <FiStar className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-800">Failed to load rating statistics</span>
        </div>
      </div>
    );
  }

  if (!ratingsData?.data?.ratings) {
    return null;
  }

  const ratings = ratingsData.data.ratings;
  const totalRatings = ratings.length;
  const approvedRatings = ratings.filter(r => r.isApproved).length;
  const pendingRatings = ratings.filter(r => !r.isApproved).length;
  const averageRating = totalRatings > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
    : 0;

  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach(rating => {
    ratingDistribution[rating.rating]++;
  });

  const ratingStatsData = [
    {
      title: "Total Reviews",
      value: totalRatings,
      change: pendingRatings,
      icon: FiStar,
      color: "blue",
      description: `${pendingRatings} pending approval`,
      trend: "up"
    },
    {
      title: "Average Rating",
      value: averageRating,
      change: "+0.2",
      icon: FiTrendingUp,
      color: "green",
      description: "Out of 5 stars",
      trend: "up"
    },
    {
      title: "Approved",
      value: approvedRatings,
      change: Math.round((approvedRatings / totalRatings) * 100),
      icon: FiCheck,
      color: "purple",
      description: `${Math.round((approvedRatings / totalRatings) * 100)}% of total`,
      trend: "up"
    },
    {
      title: "Pending",
      value: pendingRatings,
      change: Math.round((pendingRatings / totalRatings) * 100),
      icon: FiClock,
      color: "orange",
      description: `${Math.round((pendingRatings / totalRatings) * 100)}% of total`,
      trend: pendingRatings > 0 ? "up" : "neutral"
    }
  ];

  return (
    <div>
      <StatsGrid>
        {ratingStatsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </StatsGrid>
      
      {/* Rating Distribution */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiStar className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
            <span className="truncate">Rating Distribution</span>
          </h3>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-3 h-3 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-1 max-w-48">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">Review Insights</span>
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">5-Star Reviews</span>
              <span className="text-lg font-semibold text-green-600 mt-1 sm:mt-0">
                {ratingDistribution[5]}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Most Common Rating</span>
              <span className="text-lg font-semibold text-blue-600 mt-1 sm:mt-0">
                {Object.entries(ratingDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]} Stars
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-lg font-semibold text-purple-600 mt-1 sm:mt-0">
                {Math.round((approvedRatings / totalRatings) * 100)}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Reviews Today</span>
              <span className="text-lg font-semibold text-orange-600 mt-1 sm:mt-0">
                {ratings.filter(r => {
                  const today = new Date();
                  const reviewDate = new Date(r.createdAt);
                  return reviewDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingStats;