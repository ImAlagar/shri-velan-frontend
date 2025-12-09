// shared/ProductTableColumns.jsx
import React from 'react';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const getProductTableColumns = (onView, onEdit, onDelete, onToggleStatus) => [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    sortable: true,
    render: (record) => (
      <div className="flex items-center space-x-3">
        {record.images && record.images[0] && (
          <img 
            src={record.images[0]} 
            alt={record.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {record.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.category?.name || 'Uncategorized'}
          </div>
        </div>
      </div>
    )
  },
{
  title: 'Price',
  key: 'price',
  sortable: true,
  render: (record) => (
    <div className="text-sm text-gray-900">
      {/* Current Price - normalPrice */}
      <div className="font-semibold">
        ₹{record.offerPrice}
      </div>
      {/* Original Price (strikethrough) if there's an offerPrice */}
      {record.offerPrice && (
        <div className="text-xs text-gray-500 line-through">
          ₹{record.normalPrice}
        </div>
      )}
    </div>
  )
},
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    sortable: true,
    render: (record) => (
      <div className={`text-sm font-medium ${
        record.stock === 0 ? 'text-red-600' : 
        record.stock <= 10 ? 'text-orange-600' : 'text-gray-900'
      }`}>
        {record.stock}
      </div>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (record) => (
      <button
        onClick={() => onToggleStatus(record)}
        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
          record.status 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        }`}
      >
        {record.status ? 'Active' : 'Inactive'}
      </button>
    )
  },
{
  title: 'Actions',
  key: 'actions',
  render: (record) => (
    <div className="flex space-x-2">
      <Link
        to={`/admin/products/view/${record.id}`}
        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
        title="View product"
      >
        <FiEye className="w-4 h-4" />
      </Link>
      <Link 
        to={`/admin/products/edit/${record.id}`}
        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
        title="Edit product"
      >
        <FiEdit className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => onDelete(record)}
        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete product"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
];