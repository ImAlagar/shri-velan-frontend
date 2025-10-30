// components/admin/stats/UserStats.jsx
import React from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';
import { useUserStats } from '../../../hooks/useUsers';

const UserStats = () => {
  const { data: stats, isLoading, error } = useUserStats();

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
          <FiUserX className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-800">Failed to load user statistics</span>
        </div>
      </div>
    );
  }

  if (!stats?.data) {
    return null;
  }

  const userStatsData = [
    {
      title: "Total Users",
      value: stats.data.total,
      change: stats.data.newThisWeek,
      icon: FiUsers,
      color: "blue",
      description: `${stats.data.newThisWeek} new this week`,
      trend: "up"
    },
    {
      title: "Active Users",
      value: stats.data.active,
      change: Math.round((stats.data.active / stats.data.total) * 100),
      icon: FiUserCheck,
      color: "green",
      description: `${Math.round((stats.data.active / stats.data.total) * 100)}% of total`,
      trend: "up"
    },
    {
      title: "Customers",
      value: stats.data.customers,
      change: Math.round((stats.data.customers / stats.data.total) * 100),
      icon: FiUsers,
      color: "purple",
      description: `${Math.round((stats.data.customers / stats.data.total) * 100)}% of total`,
      trend: "up"
    },
    {
      title: "Avg Orders/User",
      value: stats.data.averageOrdersPerUser,
      change: stats.data.usersWithOrders,
      icon: FiShoppingBag,
      color: "orange",
      description: `${stats.data.usersWithOrders} users with orders`,
      trend: "up"
    }
  ];

  return (
    <div>
      <StatsGrid>
        {userStatsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </StatsGrid>
      
      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Users by Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
            <span className="truncate">User Overview</span>
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Administrators</span>
              <span className="text-lg font-semibold text-purple-600 mt-1 sm:mt-0">
                {stats.data.admins}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">New Today</span>
              <span className="text-lg font-semibold text-green-600 mt-1 sm:mt-0">
                {stats.data.newToday}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Users with Orders</span>
              <span className="text-lg font-semibold text-blue-600 mt-1 sm:mt-0">
                {stats.data.usersWithOrders}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Inactive Users</span>
              <span className="text-lg font-semibold text-red-600 mt-1 sm:mt-0">
                {stats.data.inactive}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Monthly Growth
          </h3>

          <div className="space-y-3">
            {stats.data.monthlyGrowth?.slice(-3).reverse().map((monthData, index) => (
              <div key={monthData.month} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition">
                <span className="text-sm font-medium text-gray-900">
                  {new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{monthData.count} users</span>
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;