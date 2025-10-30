// components/admin/stats/ContactStats.jsx
import React from 'react';
import { FiMail, FiMessageSquare, FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';
import { useContactStats } from '../../../hooks/useContacts';

const ContactStats = () => {
  const { data: stats, isLoading, error } = useContactStats();

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
          <FiMessageSquare className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-800">Failed to load contact statistics</span>
        </div>
      </div>
    );
  }

  if (!stats?.data) {
    return null;
  }

  const contactStatsData = [
    {
      title: "Total Inquiries",
      value: stats.data.total,
      change: stats.data.today,
      icon: FiMail,
      color: "blue",
      description: `${stats.data.today} new today`,
      trend: "up"
    },
    {
      title: "Pending",
      value: stats.data.pending,
      change: stats.data.thisWeek,
      icon: FiClock,
      color: "yellow",
      description: `${stats.data.thisWeek} this week`,
      alert: stats.data.pending > 10 ? "High pending inquiries" : null,
      trend: "up"
    },
    {
      title: "In Progress",
      value: stats.data.inProgress,
      change: Math.round((stats.data.inProgress / stats.data.total) * 100),
      icon: FiMessageSquare,
      color: "blue",
      description: `${Math.round((stats.data.inProgress / stats.data.total) * 100)}% of total`,
      trend: "neutral"
    },
    {
      title: "Response Rate",
      value: `${stats.data.responseRate}%`,
      change: 5,
      icon: FiCheckCircle,
      color: "green",
      description: "Resolved inquiries",
      trend: "up"
    }
  ];

  return (
    <div>
      <StatsGrid>
        {contactStatsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </StatsGrid>
      
      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
            <span className="truncate">Monthly Growth</span>
          </h3>

          <div className="space-y-3">
            {stats.data.monthlyGrowth?.slice(-3).reverse().map((monthData, index) => (
              <div key={monthData.month} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition">
                <span className="text-sm font-medium text-gray-900">
                  {new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{monthData.count} inquiries</span>
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Status Overview
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Resolved</span>
              <span className="text-lg font-semibold text-green-600 mt-1 sm:mt-0">
                {stats.data.resolved}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-lg font-semibold text-blue-600 mt-1 sm:mt-0">
                {stats.data.thisMonth}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <span className="text-sm text-gray-600">Resolution Rate</span>
              <span className="text-lg font-semibold text-purple-600 mt-1 sm:mt-0">
                {stats.data.responseRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStats;