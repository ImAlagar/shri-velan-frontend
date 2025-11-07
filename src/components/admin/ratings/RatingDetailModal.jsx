// components/admin/ratings/RatingDetailModal.jsx
import React from 'react';
import { FiX, FiUser, FiMail, FiCalendar, FiStar, FiPackage, FiCheck, FiXCircle } from 'react-icons/fi';

const RatingDetailModal = ({ isOpen, onClose, rating }) => {
  if (!isOpen || !rating) return null;

  const handleClose = () => {
    onClose();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-lg font-semibold text-gray-700 ml-2">({rating}/5)</span>
      </div>
    );
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
                <FiStar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Review Details
                </h3>
                <p className="text-sm text-gray-500">
                  Complete review information
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

          {/* Rating Information */}
          <div className="space-y-6">
            {/* User and Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <FiUser className="w-4 h-4 mr-2" />
                  User Information
                </h5>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {rating.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rating.userName}</div>
                    <div className="text-sm text-gray-500">{rating.userEmail}</div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <FiPackage className="w-4 h-4 mr-2" />
                  Product Information
                </h5>
                <div className="flex items-center space-x-3">
                  {rating.product?.images?.[0] && (
                    <img
                      src={rating.product.images[0]}
                      alt={rating.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {rating.product?.name || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {rating.productId?.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Rating</h5>
                {renderStars(rating.rating)}
              </div>

              {/* Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Status</h5>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  rating.isApproved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rating.isApproved ? (
                    <>
                      <FiCheck className="w-4 h-4 mr-1" />
                      Approved
                    </>
                  ) : (
                    <>
                      <FiXCircle className="w-4 h-4 mr-1" />
                      Pending Approval
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Review Content</h5>
              {rating.title && (
                <h6 className="text-lg font-semibold text-gray-900 mb-2">{rating.title}</h6>
              )}
              <p className="text-gray-700 leading-relaxed">
                {rating.review || 'No review text provided.'}
              </p>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Date Information
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submitted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(rating.updatedAt || rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review ID */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Technical Info</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Review ID</span>
                    <span className="text-sm font-medium text-gray-900">
                      {rating.id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product ID</span>
                    <span className="text-sm font-medium text-gray-900">
                      {rating.productId?.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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

export default RatingDetailModal;