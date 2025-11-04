// components/admin/stats/OrderStats.jsx - Updated for enum
import React from 'react';
import { 
  FiPackage, 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiTruck, 
  FiTrendingUp, 
  FiXCircle,
  FiShoppingCart,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';
import { useOrderStats } from '../../../hooks/useOrders';

const OrderStats = () => {
  const { data: stats, isLoading, error } = useOrderStats();

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
          <span className="text-red-800">Failed to load order statistics</span>
        </div>
      </div>
    );
  }

  if (!stats?.data) {
    return null;
  }

  const orderStatsData = [
    {
      title: "Total Orders",
      value: stats.data.overview?.totalOrders || 0,
      change: stats.data.trends?.orders || 0,
      icon: FiShoppingCart,
      color: "blue",
      description: "All time orders",
      trend: stats.data.trends?.orders >= 0 ? "up" : "down"
    },
    {
      title: "Pending",
      value: stats.data.overview?.pendingOrders || 0,
      change: 0,
      icon: FiClock,
      color: "yellow",
      description: "Awaiting confirmation",
      alert: (stats.data.overview?.pendingOrders || 0) > 5 ? "Review pending orders" : null,
      trend: "neutral"
    },
    {
      title: "Confirmed",
      value: stats.data.overview?.confirmedOrders || 0,
      change: 0,
      icon: FiCheckCircle,
      color: "blue",
      description: "Ready for processing",
      trend: "up"
    },
    {
      title: "Processing",
      value: stats.data.overview?.processingOrders || 0,
      change: 0,
      icon: FiRefreshCw,
      color: "purple",
      description: "In progress",
      trend: "neutral"
    },
    {
      title: "Shipped",
      value: stats.data.overview?.shippedOrders || 0,
      change: 0,
      icon: FiTruck,
      color: "indigo",
      description: "Out for delivery",
      trend: "up"
    },
    {
      title: "Delivered",
      value: stats.data.overview?.deliveredOrders || 0,
      change: 0,
      icon: FiCheckCircle,
      color: "green",
      description: "Completed orders",
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.data.overview?.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: stats.data.trends?.revenue || 0,
      icon: FiDollarSign,
      color: "green",
      description: "Lifetime revenue",
      trend: stats.data.trends?.revenue >= 0 ? "up" : "down"
    },
    {
      title: "Today's Orders",
      value: stats.data.overview?.todayOrders || 0,
      change: 0,
      icon: FiTrendingUp,
      color: "blue",
      description: "Orders placed today",
      trend: "up"
    }
  ];

  // Status colors for distribution
  const statusColors = {
    'PENDING': 'bg-yellow-500',
    'CONFIRMED': 'bg-blue-500',
    'PROCESSING': 'bg-purple-500',
    'SHIPPED': 'bg-indigo-500',
    'DELIVERED': 'bg-green-500',
    'CANCELLED': 'bg-red-500',
    'REFUNDED': 'bg-gray-500'
  };

  const statusLabels = {
    'PENDING': 'Pending',
    'CONFIRMED': 'Confirmed',
    'PROCESSING': 'Processing',
    'SHIPPED': 'Shipped',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled',
    'REFUNDED': 'Refunded'
  };

  return (
    <div>
      <StatsGrid>
        {orderStatsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </StatsGrid>
      
      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent High-Value Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
            <span className="truncate">Recent High-Value Orders</span>
          </h3>

          <div className="space-y-3">
            {stats.data.recentHighValueOrders?.map((order, index) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition"
              >
                <div className="flex items-center space-x-3 mb-2 sm:mb-0 flex-1 min-w-0">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {order.customerName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 text-sm">
                  <span className="font-semibold text-gray-900">
                    ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
            
            {(!stats.data.recentHighValueOrders || stats.data.recentHighValueOrders.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                No high-value orders found
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Order Status Distribution
          </h3>

          <div className="space-y-4">
            {stats.data.statusDistribution?.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {statusLabels[item.status] || item.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${statusColors[item.status] || 'bg-gray-500'}`}
                    style={{ 
                      width: `${(item.count / (stats.data.overview?.totalOrders || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.data.overview?.todayOrders || 0}
                </div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {stats.data.overview?.deliveredOrders || 0}
                </div>
                <div className="text-xs text-gray-500">Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;