// pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiRefreshCw, FiEye } from 'react-icons/fi';
import { showSuccess, showError, showInfo } from '../../../utils/toast'; // Import toast utilities
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';
import UserDetailModal from '../../../components/admin/users/UserDetailModal';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { 
  useUsers, 
  useDeleteUser, 
  useToggleUserStatus 
} from '../../../hooks/useUsers';
import { useUserContext } from '../../../contexts/UserContext';
import UserStats from '../../../components/admin/stats/UserStats';
import UserModal from '../../../components/admin/users/UserModel';

const AdminUsers = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useUserContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query hooks
  const { 
    data: usersData, 
    isLoading, 
    error, 
    refetch 
  } = useUsers();

  const deleteMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const users = usersData?.data?.users || [];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filters.role === 'all' || user.role === filters.role.toUpperCase();
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && user.isActive) ||
                         (filters.status === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * order;
      case 'email':
        return a.email.localeCompare(b.email) * order;
      case 'createdAt':
        return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
      case 'orders':
        return ((a._count?.orders || 0) - (b._count?.orders || 0)) * order;
      default:
        return 0;
    }
  });

  // Handle resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    showInfo(`Viewing details for ${user.name}`);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      showSuccess(`User "${selectedUser.name}" deleted successfully`);
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: user.id,
        isActive: !user.isActive
      });
      const status = !user.isActive ? 'activated' : 'deactivated';
      showSuccess(`User ${status} successfully`);
    } catch (error) {
      showError('Failed to update user status');
    }
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Users list refreshed');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      showInfo(`Searching for: ${value}`);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.role !== 'all' || newFilters.status !== 'all') {
      showInfo('Filters applied');
    }
  };

  // Desktop columns for DataTable
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'user',
      sortable: true,
      render: (record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {record.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sortable: true,
      render: (record) => (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
          record.role === 'ADMIN' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {record.role}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (record) => (
        <button
          onClick={() => handleToggleStatus(record)}
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
            record.isActive 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {record.isActive ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      title: 'Orders',
      dataIndex: '_count',
      key: 'orders',
      sortable: true,
      render: (record) => (
        <div className="text-sm font-medium text-gray-900">
          {record._count?.orders || 0}
        </div>
      )
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sortable: true,
      render: (record) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View user"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit user"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete user"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Mobile card render function
  const renderUserCard = (user) => (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Role & Status */}
              <div className="flex flex-col items-end space-y-1 ml-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.isActive
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-600">
                {user._count?.orders || 0} orders
              </div>
              <div className="text-xs text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 mt-3 sm:mt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(user);
            }}
            className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
          >
            <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className="text-green-600 hover:text-green-900 p-2 sm:p-2.5 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
          >
            <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            className="text-red-600 hover:text-red-900 p-2 sm:p-2.5 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
          >
            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-400 rounded-full mr-3"></div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Failed to load users</h3>
                <p className="text-red-600 mt-1">{error.message}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Users
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage system users ({users.length} total)
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="mb-6 lg:mb-8">
          <UserStats />
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search users by name or email..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange({ role: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={sortedUsers}
              renderItem={renderUserCard}
              emptyMessage="No users found"
              emptyAction={
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Your First User</span>
                </button>
              }
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedUsers}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No users found</div>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm || filters.role !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by creating your first user'
                  }
                </p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Your First User</span>
                </button>
              </div>
            }
            className="border-0"
          />
        )}
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={handleCreate}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
          aria-label="Add User"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete User"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminUsers;