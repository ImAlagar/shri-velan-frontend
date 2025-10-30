import React from 'react';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiPlusSquare } from 'react-icons/fi';
import DashboardStats from '../../../components/admin/stats/DashboardStats';

const AdminDashboard = () => {


  const recentActivities = [
    { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Product added', user: 'Sarah Wilson', time: '5 min ago' },
    { id: 3, action: 'User registered', user: 'Mike Johnson', time: '10 min ago' },
    { id: 4, action: 'Order completed', user: 'Emily Davis', time: '15 min ago' },
    { id: 5, action: 'Product updated', user: 'Admin', time: '20 min ago' }
  ];

  return (
    <div className="p-2">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your Dashboard</p>
        </div>
      </div>
      <div className="mb-6">
        <DashboardStats  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <FiPlusSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Product</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
              <FiShoppingBag className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Orders</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
              <FiUsers className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center">
              <FiPackage className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Categories</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;