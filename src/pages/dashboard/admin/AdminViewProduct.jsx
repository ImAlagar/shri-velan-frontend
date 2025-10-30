import React from 'react';
import {
  FiArrowLeft,
  FiEdit,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProducts';

const AdminViewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: productData, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <FiX className="w-6 h-6 text-red-400 mb-2 sm:mb-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Failed to load product</h3>
              <p className="text-red-600 mt-1 text-sm">{error.message}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors w-full sm:w-auto"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const product = productData?.data;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-500 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
          <div className="mt-2 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Product details and information
            </p>
          </div>
        </div>
        <Link
          to={`/admin/products/edit/${product.id}`}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <FiEdit className="w-4 h-4" />
          <span>Edit Product</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-28 sm:h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiPackage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <label className="block text-gray-500 mb-1">Product Name</label>
                <p className="text-gray-900">{product.name}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Category</label>
                <p className="text-gray-900">{product.category?.name || 'Uncategorized'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div>
                  <label className="block text-gray-500 mb-1">Weight</label>
                  <p className="text-gray-900">{product.weight || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Combo Product</label>
                  <div className="flex items-center space-x-2">
                    {product.isCombo ? (
                      <FiCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <FiX className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={
                        product.isCombo ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {product.isCombo ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Normal Price</label>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="w-4 h-4 text-gray-500" />
                  <p className="text-lg font-semibold text-gray-900">${product.normalPrice}</p>
                </div>
              </div>
              {product.offerPrice && (
                <div>
                  <label className="block text-gray-500 mb-1">Offer Price</label>
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="w-4 h-4 text-red-500" />
                    <p className="text-lg font-semibold text-red-600">${product.offerPrice}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-500 mb-1">Stock Quantity</label>
                <p
                  className={`text-lg font-semibold ${
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock <= 10
                      ? 'text-orange-600'
                      : 'text-gray-900'
                  }`}
                >
                  {product.stock}
                </p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Status</label>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span
                    className={
                      product.status ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {product.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTag className="w-5 h-5 mr-2 text-purple-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-500 mb-1">Product ID</label>
                <p className="text-gray-900 font-mono break-all">{product.id}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Created At</label>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Total Images</label>
                <p className="text-gray-900">{product.images?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewProduct;
