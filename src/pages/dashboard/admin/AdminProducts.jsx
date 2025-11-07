// pages/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProductStats from '../../../components/admin/stats/ProductStats';
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { getProductTableColumns } from '../../../shared/ProductTableColumns';
import { 
  useProducts, 
  useDeleteProduct, 
  useToggleProductStatus,
  useProductStats 
} from '../../../hooks/useProducts';
import { useProductContext } from '../../../contexts/ProductContext';
import { useToggleFeatured } from '../../../hooks/useProducts';


const AdminProducts = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useProductContext();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query hooks
  const { 
    data: productsData, 
    isLoading, 
    error, 
    refetch 
  } = useProducts({
    search: searchTerm,
    status: filters.status === 'all' ? undefined : filters.status === 'active',
    category: filters.category === 'all' ? undefined : filters.category,
    page: 1,
    limit: 100 // Adjust based on your needs
  });

  const { data: statsData } = useProductStats();
  const deleteMutation = useDeleteProduct();
  const toggleStatusMutation = useToggleProductStatus();
  const toggleFeatured = useToggleFeatured();
  const products = productsData?.data?.products || [];
  const stats = statsData?.data || {};

  // Handle resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleView = (product) => {
    console.log('View product:', product);
    // Navigate to product detail page or show modal
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // Navigate to edit page
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: product.id,
        status: !product.status
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleToggleFeatured = async (product) => {
  try {
    await toggleFeatured.mutateAsync({
      id: product.id,
      isFeatured: !product.isFeatured
    });
  } catch (error) {
    // Error handled by mutation
  }
};

  const handleRefresh = () => {
    refetch();
    toast.success('Products refreshed');
  };

  // Mobile card render function
const renderProductCard = (product) => (
  <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start space-x-3">
      {/* Product Image */}
      {product.images && product.images[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
        />
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
              {product.category?.name || "Uncategorized"}
            </p>
          </div>

          {/* Status Button */}
          <div className='flex flex-col items-end space-y-1 ml-2'>
             <button
              onClick={() => handleToggleFeatured(product)}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                product.isFeatured
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {product.isFeatured ? "Featured" : "Feature"}
            </button>

                        {/* Active Status */}
            <button
              onClick={() => handleToggleStatus(product)}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                product.status
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {product.status ? "Active" : "Inactive"}
            </button>
          </div>
          
        </div>

        {/* Price + Stock + Actions */}
        <div className="mt-3 flex items-end justify-between flex-wrap gap-2">
          <div>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              ${product.normalPrice}
              {product.offerPrice && (
                <span className="text-sm text-red-600 line-through ml-2">
                  ${product.offerPrice}
                </span>
              )}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                product.stock === 0
                  ? "text-red-600"
                  : product.stock <= 10
                  ? "text-orange-600"
                  : "text-gray-500"
              }`}
            >
              {product.stock} in stock
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1 relative z-10">
            <Link
              to={`/admin/products/view/${product.id}`}
              className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
              title="View product"
            >
              <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link 
              to={`/admin/products/edit/${product.id}`}
              className="text-green-600 hover:text-green-900 p-2 sm:p-2.5 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
              title="Edit product"
            >
              <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product);
              }}
              className="text-red-600 hover:text-red-900 p-2 sm:p-2.5 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
              title="Delete product"
            >
              <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);


  const emptyAction = (
    <Link
      to="/admin/products/add"
      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      <FiPlus className="w-4 h-4" />
      <span>Add Your First Product</span>
    </Link>
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
              <div className="flex-shrink-0">
                <FiXCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Failed to load products</h3>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Products</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your product inventory ({products.length} total)
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
            <Link
              to="/admin/products/add"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Product Statistics */}
        <div className="mb-6 lg:mb-8">
          <ProductStats stats={stats} />
        </div>
      </div>

      {/* Products Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={products}
              renderItem={renderProductCard}
              emptyMessage="No products found"
              emptyAction={emptyAction}
            />
          </div>
        ) : (
          <DataTable
            columns={getProductTableColumns(handleView, handleEdit, handleDelete, handleToggleStatus)}
            data={products}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No products found</div>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm || filters.status !== 'all' || filters.category !== 'all'
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by creating your first product'
                  }
                </p>
                {emptyAction}
              </div>
            }
            className="border-0"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminProducts;