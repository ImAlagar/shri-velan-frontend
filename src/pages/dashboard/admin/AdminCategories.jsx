// pages/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';
import CategoryModal from '../../../components/admin/categories/CategoryModal';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { 
  useCategories, 
  useDeleteCategory, 
  useToggleCategoryStatus 
} from '../../../hooks/useCategories';
import { useCategoryContext } from '../../../contexts/CategoryContext';
import CategoryStats from '../../../components/admin/stats/CategoryStats';

const AdminCategories = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useCategoryContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query hooks
  const { 
    data: categoriesData, 
    isLoading, 
    error, 
    refetch 
  } = useCategories();

  const deleteMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  const categories = categoriesData?.data || [];

  // Filter categories based on search and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && category.isActive) ||
                         (filters.status === 'inactive' && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * order;
      case 'products':
        return (a.products?.length - b.products?.length) * order;
      case 'createdAt':
        return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
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
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: category.id,
        isActive: !category.isActive
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Categories refreshed');
  };

  // Desktop columns for DataTable
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      sortable: true,
      render: (record) => (
        <div className="flex items-center space-x-3">
          {record.image && (
            <img 
              src={record.image} 
              alt={record.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{record.name}</div>
            {record.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {record.description}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      sortable: true,
      render: (record) => (
        <div className="text-sm text-gray-900">
          {record.products?.length || 0}
        </div>
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
      title: 'Created',
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
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit category"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete category"
            disabled={record.products?.length > 0}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Mobile card render function
const renderCategoryCard = (category) => (
  <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      {/* Left: Image + Info */}
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Category Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {category.name}
            </h3>

            {/* Active / Inactive toggle */}
            <button
              onClick={() => handleToggleStatus(category)}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                category.isActive
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </button>
          </div>

          {/* Description */}
          {category.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 break-words">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Stats + Actions */}
      <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end flex-wrap gap-2">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
          <span>{category.products?.length || 0} products</span>
          <span>{new Date(category.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(category);
            }}
            className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
          >
            <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(category);
            }}
            className={`p-2 sm:p-2.5 rounded-lg transition-colors active:scale-95 ${
              category.products?.length > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-900 hover:bg-red-50"
            }`}
            disabled={category.products?.length > 0}
          >
            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
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
              <FiXCircle className="w-6 h-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Failed to load categories</h3>
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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-2">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Categories
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage product categories ({categories.length} total)
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
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="mb-6 lg:mb-8">
          <CategoryStats />
        </div>
      </div>

      {/* Categories Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={sortedCategories}
              renderItem={renderCategoryCard}
              emptyMessage="No categories found"
              emptyAction={
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Your First Category</span>
                </button>
              }
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedCategories}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No categories found</div>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm || filters.status !== 'all' 
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by creating your first category'
                  }
                </p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Your First Category</span>
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
          aria-label="Add Category"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete Category"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminCategories;