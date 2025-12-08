// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiEdit, FiTruck, FiPlus, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import DataCard from '../../../shared/DataCard';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { useOrderContext } from '../../../contexts/OrderContext';
import { 
  useOrders, 
  useUpdateOrderStatus, 
  useDeleteOrder 
} from '../../../hooks/useOrders';
import OrderStats from '../../../components/admin/stats/OrderStats';
import OrderModal from '../../../components/admin/order/OrderModal';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useOrderContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // React Query hooks
  const { 
    data: ordersResponse, 
    isLoading, 
    error, 
    refetch 
  } = useOrders();

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  // Safely extract orders array with fallback
  const orders = React.useMemo(() => {
    if (ordersResponse?.data?.orders) {
      return ordersResponse.data.orders;
    }
    if (ordersResponse?.orders) {
      return ordersResponse.orders;
    }
    if (Array.isArray(ordersResponse)) {
      return ordersResponse;
    }
    if (ordersResponse?.data && Array.isArray(ordersResponse.data)) {
      return ordersResponse.data;
    }
    return [];
  }, [ordersResponse]);

  // Use UPPERCASE status colors to match your enum
  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-purple-100 text-purple-800',
    'SHIPPED': 'bg-indigo-100 text-indigo-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'REFUNDED': 'bg-gray-100 text-gray-800'
  };

  // Use UPPERCASE status options to match your enum
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' }
  ];

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    return orders.filter(order => {
      if (!order || typeof order !== 'object') return false;
      
      const customerName = order.name || order.user?.name || '';
      const customerEmail = order.email || order.user?.email || '';
      const orderNumber = order.orderNumber || '';
      
      const matchesSearch = searchTerm === '' || 
        orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || order.status === filters.status;
      const matchesPaymentStatus = filters.paymentStatus === 'all' || order.paymentStatus === filters.paymentStatus;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [orders, searchTerm, filters.status, filters.paymentStatus]);

  // Sort orders - newest first by default
  const sortedOrders = React.useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [filteredOrders]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  // Handle resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters.status, filters.paymentStatus]);

  // Handlers
  const handleCreate = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleView = (order) => {
    navigate(`/admin/orders/${order.id}`);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    
    try {
      await deleteOrderMutation.mutateAsync(selectedOrder.id);
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleStatusUpdate = async (order, newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ 
        id: order.id,
        status: newStatus 
      });
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Orders refreshed');
  };

  // Filter handlers
  const handleStatusFilterChange = (status) => {
    setFilters({ ...filters, status });
  };

  const handlePaymentStatusFilterChange = (paymentStatus) => {
    setFilters({ ...filters, paymentStatus });
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Helper function to get customer display data
  const getCustomerDisplay = (order) => {
    return {
      name: order.name || order.user?.name || 'Unknown Customer',
      email: order.email || order.user?.email || 'No email'
    };
  };

  // Helper function to get product image
  const getProductImage = (order) => {
    if (order.orderItems && order.orderItems.length > 0 && order.orderItems[0].product) {
      const firstProduct = order.orderItems[0].product;
      if (firstProduct.images && firstProduct.images.length > 0) {
        return firstProduct.images[0];
      }
    }
    return '/images/placeholder-product.jpg';
  };

  // Helper function to get product names
  const getProductNames = (order) => {
    if (!order.orderItems || order.orderItems.length === 0) return 'No items';
    
    const names = order.orderItems.map(item => 
      item.product?.name || 'Unknown Product'
    );
    
    if (names.length === 1) return names[0];
    return `${names[0]} +${names.length - 1} more`;
  };

  // Mobile card render function
  const renderOrderCard = (order) => {
    const customer = getCustomerDisplay(order);
    const productImage = getProductImage(order);
    const productNames = getProductNames(order);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {order.orderNumber || 'N/A'}
                </h3>
                <div className="mt-1 space-y-1">
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Customer:</span> {customer.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {customer.email}
                  </div>
                </div>
              </div>

              {/* Status Dropdown */}
              <select
                value={order.status || 'PENDING'}
                onChange={(e) => handleStatusUpdate(order, e.target.value)}
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-green-500 cursor-pointer flex-shrink-0 ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Image and Details */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                <img 
                  src={productImage} 
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {productNames}
                </div>
                <div className="text-xs text-gray-500">
                  {Array.isArray(order.orderItems) ? order.orderItems.length : 0} item(s)
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Payment</div>
                <div className="text-sm font-medium text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Amount</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="flex items-center justify-end border-t border-gray-100 pt-3">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(order);
              }}
              className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
              title="View Order Details"
            >
              <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(order);
              }}
              className="text-red-600 hover:text-red-900 p-2 sm:p-2.5 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
              title="Delete Order"
            >
              <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>entries per page</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedOrders.length)} of {sortedOrders.length} entries
        </div>
      </div>
    );
  };

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
              <FiXCircle className="w-6 h-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Failed to load orders</h3>
                <p className="text-red-600 mt-1">
                  {error.response?.data?.message || error.message || 'Unknown error occurred'}
                </p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Orders</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage customer orders ({orders.length} total, {sortedOrders.length} filtered)
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base disabled:bg-gray-400"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Order</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => handlePaymentStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {paymentStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Order Statistics */}
        <div className="mb-6 lg:mb-8">
          <OrderStats />
        </div>
      </div>

      {/* Orders Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={paginatedOrders}
              renderItem={renderOrderCard}
              emptyMessage="No orders found"
              emptyAction={
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create Your First Order</span>
                </button>
              }
            />
            {sortedOrders.length > 0 && <Pagination />}
          </div>
        ) : (
          <div className="p-6">
            {/* Simple HTML Table as replacement for DataTable */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Items</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Payment</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const customer = getCustomerDisplay(order);
                    const productImage = getProductImage(order);
                    const productNames = getProductNames(order);
                    
                    return (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={productImage} 
                              alt="Product"
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = '/images/placeholder-product.jpg';
                              }}
                            />
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {productNames}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">
                            {Array.isArray(order.orderItems) ? order.orderItems.length : 0}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status || 'PENDING'}
                            onChange={(e) => handleStatusUpdate(order, e.target.value)}
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-green-500 cursor-pointer ${
                              statusColors[order.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleView(order)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Order Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => handleDelete(order)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <FiTruck className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {sortedOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No orders found</div>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchTerm || filters.status !== 'all' || filters.paymentStatus !== 'all'
                      ? 'Try adjusting your search criteria' 
                      : 'Get started by creating your first order'
                    }
                  </p>
                  <button
                    onClick={handleCreate}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Create Your First Order</span>
                  </button>
                </div>
              )}
            </div>
            
            {sortedOrders.length > 0 && <Pagination />}
          </div>
        )}
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={handleCreate}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
          aria-label="Add Order"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        mode={selectedOrder ? (selectedOrder.id ? 'edit' : 'view') : 'create'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order "${selectedOrder?.orderNumber}"? This action cannot be undone.`}
        confirmText="Delete Order"
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};

export default AdminOrders;