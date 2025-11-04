import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiEdit, FiTruck, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import OrderStats from '../../../components/admin/stats/OrderStats';
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2024-01-15',
      amount: 125.99,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      date: '2024-01-14',
      amount: 89.50,
      status: 'Processing',
      items: 2
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      date: '2024-01-14',
      amount: 234.75,
      status: 'Shipped',
      items: 5
    },
    {
      id: 'ORD-004',
      customer: 'Emily Davis',
      email: 'emily@example.com',
      date: '2024-01-13',
      amount: 67.25,
      status: 'Pending',
      items: 1
    },
    {
      id: 'ORD-005',
      customer: 'Robert Brown',
      email: 'robert@example.com',
      date: '2024-01-12',
      amount: 156.80,
      status: 'Cancelled',
      items: 4
    }
  ];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  // Handle resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleView = (order) => {
    // Implement view functionality
  };

  const handleEdit = (order) => {
    console.log('Edit order:', order);
    // Implement edit functionality
  };

  const handleShipping = (order) => {
    console.log('Update shipping:', order);
    // Implement shipping functionality
  };

  // Desktop columns
  const desktopColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (record) => (
        <div className="text-sm font-medium text-gray-900">{record.id}</div>
      )
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.customer}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (record) => (
        <div className="text-sm text-gray-900">{record.date}</div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (record) => (
        <div className="text-sm font-medium text-gray-900">${record.amount}</div>
      )
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (record) => (
        <div className="text-sm text-gray-900">{record.items}</div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (record) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status]}`}>
          {record.status}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleShipping(record)}
            className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition-colors"
          >
            <FiTruck className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Mobile card render function
  const renderOrderCard = (order) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900">
              {order.id}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium text-gray-900 mr-2">Customer:</span>
              {order.customer}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {order.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Date</div>
          <div className="text-sm font-medium text-gray-900">{order.date}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Items</div>
          <div className="text-sm font-medium text-gray-900">{order.items}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-gray-900">
          ${order.amount}
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => handleView(order)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Order"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEdit(order)}
            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Order"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleShipping(order)}
            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
            title="Update Shipping"
          >
            <FiTruck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const emptyAction = (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-4">
        No orders match your search criteria
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Orders</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer orders</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <Link
              to="/admin/orders/create"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create Order</span>
            </Link>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="mb-6 lg:mb-8">
          <OrderStats orders={orders} />
        </div>
      </div>

      {/* Orders Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={filteredOrders}
              renderItem={renderOrderCard}
              emptyMessage="No orders found"
              emptyAction={emptyAction}
            />
          </div>
        ) : (
          <DataTable
            columns={desktopColumns}
            data={filteredOrders}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No orders found</div>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your search or filter criteria
                </p>
                {emptyAction}
              </div>
            }
            className="border-0"
          />
        )}
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Link
          to="/admin/orders/create"
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
          aria-label="Create Order"
        >
          <FiPlus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default AdminOrders;