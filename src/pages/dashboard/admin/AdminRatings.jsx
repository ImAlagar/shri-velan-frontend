// pages/AdminRatings.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiEye, FiCheck, FiX, FiStar, FiTrash2 } from 'react-icons/fi';
import { showSuccess, showError, showInfo } from '../../../utils/toast';
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';
import RatingDetailModal from '../../../components/admin/ratings/RatingDetailModal';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { 
  useRatings, 
  useUpdateRatingStatus, 
  useDeleteRating 
} from '../../../hooks/useRatings';
import { useRatingContext } from '../../../contexts/RatingContext';
import RatingStats from '../../../components/admin/stats/RatingStats';

const AdminRatings = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useRatingContext();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query hooks
  const { 
    data: ratingsData, 
    isLoading, 
    error, 
    refetch 
  } = useRatings();

  const updateStatusMutation = useUpdateRatingStatus();
  const deleteMutation = useDeleteRating();

  const ratings = ratingsData?.data?.ratings || [];
  const pagination = ratingsData?.data?.pagination || {};

  // Filter ratings based on search and filters
  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.review?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.approved === 'all' || 
                         (filters.approved === 'approved' && rating.isApproved) ||
                         (filters.approved === 'pending' && !rating.isApproved);
    
    const matchesRating = filters.rating === 'all' || 
                         rating.rating === parseInt(filters.rating);

    return matchesSearch && matchesStatus && matchesRating;
  });

  // Sort ratings
  const sortedRatings = [...filteredRatings].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'userName':
        return a.userName.localeCompare(b.userName) * order;
      case 'rating':
        return (a.rating - b.rating) * order;
      case 'createdAt':
        return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
      case 'product':
        return a.product?.name?.localeCompare(b.product?.name) * order;
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
  const handleView = (rating) => {
    setSelectedRating(rating);
    setIsDetailModalOpen(true);
    showInfo(`Viewing review from ${rating.userName}`);
  };

  const handleApprove = async (rating) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: rating.id,
        isApproved: true
      });
      showSuccess(`Review from ${rating.userName} approved successfully`);
    } catch (error) {
      showError('Failed to approve review');
    }
  };

  const handleReject = async (rating) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: rating.id,
        isApproved: false
      });
      showSuccess(`Review from ${rating.userName} rejected`);
    } catch (error) {
      showError('Failed to reject review');
    }
  };

  const handleDelete = (rating) => {
    setSelectedRating(rating);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRating) return;
    
    try {
      await deleteMutation.mutateAsync(selectedRating.id);
      setIsDeleteModalOpen(false);
      setSelectedRating(null);
      showSuccess(`Review from "${selectedRating.userName}" deleted successfully`);
    } catch (error) {
      showError('Failed to delete review');
    }
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Reviews list refreshed');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      showInfo(`Searching for: ${value}`);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.approved !== 'all' || newFilters.rating !== 'all') {
      showInfo('Filters applied');
    }
  };

  // Star rating display component
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">({rating})</span>
      </div>
    );
  };

  // Status badge component
  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiCheck className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FiX className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  // Desktop columns for DataTable
  const columns = [
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
      render: (record) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {record.userName?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">{record.userName}</div>
            <div className="text-sm text-gray-500 truncate">{record.userEmail}</div>
            {record.title && (
              <div className="text-sm font-semibold text-gray-900 mt-1">{record.title}</div>
            )}
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              {record.review || 'No review text'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sortable: true,
      render: (record) => (
        <div className="flex items-center space-x-3">
          {record.product?.images?.[0] && (
            <img
              src={record.product.images[0]}
              alt={record.product.name}
              className="w-10 h-10 object-cover rounded-lg"
            />
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {record.product?.name || 'Unknown Product'}
            </div>
            <div className="text-sm text-gray-500">
              #{record.productId?.slice(-8)}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sortable: true,
      render: (record) => renderStars(record.rating)
    },
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'status',
      render: (record) => getStatusBadge(record.isApproved)
    },
    {
      title: 'Date',
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
            title="View review"
          >
            <FiEye className="w-4 h-4" />
          </button>
          {!record.isApproved && (
            <button 
              onClick={() => handleApprove(record)}
              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="Approve review"
            >
              <FiCheck className="w-4 h-4" />
            </button>
          )}
          {record.isApproved && (
            <button 
              onClick={() => handleReject(record)}
              className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Reject review"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete review"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Mobile card render function
  const renderRatingCard = (rating) => (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {rating.userName?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>

          {/* Rating Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {rating.userName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{rating.userEmail}</p>
                
                {rating.title && (
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {rating.title}
                  </p>
                )}
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {rating.review || 'No review text'}
                </p>
              </div>

              {/* Rating & Status */}
              <div className="flex flex-col items-end space-y-1 ml-2">
                {renderStars(rating.rating)}
                {getStatusBadge(rating.isApproved)}
              </div>
            </div>

            {/* Product & Date */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-600 truncate">
                {rating.product?.name || 'Unknown Product'}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(rating.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 mt-3 sm:mt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(rating);
            }}
            className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
          >
            <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {!rating.isApproved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(rating);
              }}
              className="text-green-600 hover:text-green-900 p-2 sm:p-2.5 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
            >
              <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {rating.isApproved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(rating);
              }}
              className="text-yellow-600 hover:text-yellow-900 p-2 sm:p-2.5 hover:bg-yellow-50 rounded-lg transition-colors active:scale-95"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(rating);
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
                <h3 className="text-lg font-medium text-red-800">Failed to load reviews</h3>
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
              Reviews Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage customer reviews and ratings ({ratings.length} total)
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
          </div>
        </div>

        {/* Rating Statistics */}
        <div className="mb-6 lg:mb-8">
          <RatingStats />
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
                placeholder="Search reviews by user, product, or content..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.approved}
              onChange={(e) => handleFilterChange({ approved: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>

            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange({ rating: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="userName">Sort by User</option>
              <option value="product">Sort by Product</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={sortedRatings}
              renderItem={renderRatingCard}
              emptyMessage="No reviews found"
              emptyDescription={
                searchTerm || filters.approved !== 'all' || filters.rating !== 'all'
                  ? 'Try adjusting your search criteria' 
                  : 'No reviews have been submitted yet'
              }
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedRatings}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No reviews found</div>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm || filters.approved !== 'all' || filters.rating !== 'all'
                    ? 'Try adjusting your search criteria' 
                    : 'No reviews have been submitted yet'
                  }
                </p>
              </div>
            }
            className="border-0"
          />
        )}
      </div>

      {/* Rating Detail Modal */}
      <RatingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRating(null);
        }}
        rating={selectedRating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRating(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Review"
        message={`Are you sure you want to delete the review from "${selectedRating?.userName}"? This action cannot be undone.`}
        confirmText="Delete Review"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminRatings;