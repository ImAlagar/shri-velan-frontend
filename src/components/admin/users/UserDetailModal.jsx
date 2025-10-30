// components/admin/users/UserDetailModal.jsx
import React from 'react';
import { FiX, FiUser, FiMail, FiCalendar, FiPackage, FiStar, FiMapPin } from 'react-icons/fi';

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  User Details
                </h3>
                <p className="text-sm text-gray-500">
                  Complete user information
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar and Name */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Status and Role */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Role</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <FiPackage className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-blue-600">{user._count?.orders || 0}</div>
                <div className="text-sm text-blue-500">Orders</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <FiStar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-green-600">{user._count?.ratings || 0}</div>
                <div className="text-sm text-green-500">Ratings</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <FiCalendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-purple-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-purple-500">Joined</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <FiMapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-orange-600">{user.addresses?.length || 0}</div>
                <div className="text-sm text-orange-500">Addresses</div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Account Information</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity (if available) */}
            {user.orders && user.orders.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Recent Orders</h5>
                <div className="space-y-2">
                  {user.orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-2 bg-white rounded">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Order #{order.id.slice(-8)}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        ${order.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={handleClose}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;