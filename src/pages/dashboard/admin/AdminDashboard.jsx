import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  PlusSquare,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../../../components/admin/stats/DashboardStats';
import { dashboardService } from '../../../services/dashboardService';
import { useAuth } from '../../../hooks/useAuth';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [showAllActivities, setShowAllActivities] = useState(false);

  const { user, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const initialActivityCount = 5;
  const visibleActivities = showAllActivities ? recentActivities.length : initialActivityCount;

  const toggleShowMore = () => setShowAllActivities(!showAllActivities);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardService.getDashboardStats(timeRange),
        dashboardService.getRecentActivities()
      ]);
      setDashboardData(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [timeRange, isAuthenticated, isAdmin]);

  const handleRefresh = () => fetchDashboardData();
  const handleTimeRangeChange = (range) => setTimeRange(range);
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-product':
        navigate('/admin/products/add');
        break;
      case 'view-orders':
        navigate('/admin/orders');
        break;
      case 'manage-users':
        navigate('/admin/users');
        break;
      case 'categories':
        navigate('/admin/categories');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[24rem]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <DashboardStats data={dashboardData} timeRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <span className="text-sm text-gray-500">{recentActivities.length} activities</span>
          </div>

          <div className="space-y-4">
            {recentActivities.slice(0, visibleActivities).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'order'
                      ? 'bg-blue-500'
                      : activity.type === 'user'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} • {activity.time}
                    {activity.metadata?.amount && ` • $${activity.metadata.amount}`}
                  </p>
                </div>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent activities</p>
            )}
          </div>

          {recentActivities.length > initialActivityCount && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleShowMore}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {showAllActivities
                  ? 'Show Less'
                  : `Show More (${recentActivities.length - initialActivityCount} more)`}
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickAction('add-product')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
            >
              <PlusSquare className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Add Product</p>
            </button>

            <button
              onClick={() => handleQuickAction('view-orders')}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group"
            >
              <ShoppingBag className="w-6 h-6 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">View Orders</p>
            </button>

            <button
              onClick={() => handleQuickAction('manage-users')}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center group"
            >
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>

            <button
              onClick={() => handleQuickAction('categories')}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center group"
            >
              <Package className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Categories</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
