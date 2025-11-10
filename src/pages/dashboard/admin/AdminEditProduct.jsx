import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiArrowLeft, FiSave, FiPlus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: productData, isLoading: productLoading } = useProduct(id);
  const updateProductMutation = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    weight: '',
    isCombo: false,
    isFeatured: false,
    normalPrice: '',
    offerPrice: '',
    benefits: [],
    ingredients: [],
    preparingMethods: [], // ✅ ADD PREPARING METHODS
    tags: [],
    stock: 0,
    status: true
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [preparingMethodInput, setPreparingMethodInput] = useState(''); // ✅ ADD PREPARING METHOD INPUT
  const [tagInput, setTagInput] = useState('');

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data || [];

  // Load product data when available
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        weight: product.weight || '',
        isCombo: product.isCombo || false,
        isFeatured: product.isFeatured || false,
        normalPrice: product.normalPrice || '',
        offerPrice: product.offerPrice || '',
        benefits: product.benefits || [],
        ingredients: product.ingredients || [],
        preparingMethods: product.preparingMethods || [], // ✅ LOAD PREPARING METHODS
        tags: product.tags || [],
        stock: product.stock || 0,
        status: product.status ?? true
      });

      // Set existing images
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images.map((url, index) => ({
          id: `existing-${index}`,
          url,
          type: 'existing'
        })));
      }
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'normalPrice' || name === 'offerPrice' || name === 'stock') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + existingImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      type: 'new'
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id, type) => {
    if (type === 'existing') {
      setExistingImages(prev => prev.filter(img => img.id !== id));
    } else {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  // Benefits management
  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  // Ingredients management
  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // ✅ PREPARING METHODS MANAGEMENT
  const addPreparingMethod = () => {
    if (preparingMethodInput.trim()) {
      setFormData(prev => ({
        ...prev,
        preparingMethods: [...prev.preparingMethods, preparingMethodInput.trim()]
      }));
      setPreparingMethodInput('');
    }
  };

  const removePreparingMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      preparingMethods: prev.preparingMethods.filter((_, i) => i !== index)
    }));
  };

  const updatePreparingMethod = (index, value) => {
    const updatedMethods = [...formData.preparingMethods];
    updatedMethods[index] = value;
    setFormData(prev => ({
      ...prev,
      preparingMethods: updatedMethods
    }));
  };

  const addEmptyPreparingMethod = () => {
    setFormData(prev => ({
      ...prev,
      preparingMethods: [...prev.preparingMethods, '']
    }));
  };

  // Tags management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.normalPrice || formData.normalPrice <= 0) {
      toast.error('Please enter a valid normal price');
      return;
    }
    if (formData.stock < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }
    if (existingImages.length === 0 && images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    try {
      const submitData = new FormData();
      
      // Append basic fields
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('categoryId', formData.categoryId);
      submitData.append('weight', formData.weight || '');
      submitData.append('isCombo', formData.isCombo.toString());
      submitData.append('isFeatured', formData.isFeatured.toString());
      submitData.append('normalPrice', formData.normalPrice.toString());
      submitData.append('stock', formData.stock.toString());
      submitData.append('status', formData.status.toString());
      
      if (formData.offerPrice && formData.offerPrice > 0) {
        submitData.append('offerPrice', formData.offerPrice.toString());
      } else {
        submitData.append('offerPrice', '');
      }
      
      // Send arrays as JSON strings
      submitData.append('benefits', JSON.stringify(formData.benefits));
      submitData.append('ingredients', JSON.stringify(formData.ingredients));
      submitData.append('preparingMethods', JSON.stringify(formData.preparingMethods)); // ✅ ADD PREPARING METHODS
      submitData.append('tags', JSON.stringify(formData.tags));
      
      // Append existing images
      if (existingImages.length > 0) {
        submitData.append('existingImages', JSON.stringify(
          existingImages.map(img => img.url)
        ));
      }
      
      // Append new images
      images.forEach(image => {
        submitData.append('images', image.file);
      });

      const formDataEntries = {};
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          if (!formDataEntries[key]) formDataEntries[key] = [];
          formDataEntries[key].push(`File: ${value.name} (${value.size} bytes)`);
        } else {
          if (!formDataEntries[key]) formDataEntries[key] = [];
          formDataEntries[key].push(value);
        }
      }
      
      Object.keys(formDataEntries).forEach(key => {
        if (formDataEntries[key].length === 1) {
          console.log(`  ${key}:`, formDataEntries[key][0]);
        } else {
          console.log(`  ${key}:`, formDataEntries[key]);
        }
      });

      // Call the mutation and wait for the response
      const result = await updateProductMutation.mutateAsync({
        id,
        data: submitData
      });

      // Check if the response indicates success
      if (result && result.success) {
        toast.success('Product updated successfully!');
        navigate('/admin/products');
      } else {
        // If no success flag, show generic error
        toast.error('Product update completed but no success confirmation');
        console.warn('Update completed but no success flag:', result);
      }
      
    } catch (error) {
      console.error('❌ Product update failed:', error);
      
      // Check for specific error types
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        toast.error(`Update failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        toast.error('Update failed: No response from server');
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        toast.error(`Update failed: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/admin/products');
    }
  };

  const allImages = [...existingImages, ...images];

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header with Back Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-0"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Products</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Edit Product
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Update product information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    disabled={categoriesLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoriesLoading && (
                    <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isCombo"
                      checked={formData.isCombo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      This is a combo product
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Mark as featured product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Add a benefit"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>

                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Add an ingredient"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>

                {formData.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* ✅ PREPARING METHODS SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation Methods</h3>
              
              <div className="space-y-4">
                {/* Quick Add Method */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <input
                      type="text"
                      value={preparingMethodInput}
                      onChange={(e) => setPreparingMethodInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreparingMethod())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Add a preparation method"
                    />
                    <button
                      type="button"
                      onClick={addPreparingMethod}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Methods List */}
                {formData.preparingMethods.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-sm font-medium text-gray-700">
                        {formData.preparingMethods.length} method(s) added
                      </p>
                      <button
                        type="button"
                        onClick={addEmptyPreparingMethod}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Empty</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {formData.preparingMethods.map((method, index) => (
                        <div key={index} className="flex space-x-2 items-start">
                          <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs mt-1">
                            {index + 1}
                          </div>
                          <textarea
                            value={method}
                            onChange={(e) => updatePreparingMethod(index, e.target.value)}
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            placeholder={`Preparation method ${index + 1}...`}
                          />
                          <button
                            type="button"
                            onClick={() => removePreparingMethod(index)}
                            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {formData.preparingMethods.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FiPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No preparation methods added yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Add methods to help customers prepare your product
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Normal Price *
                  </label>
                  <input
                    type="number"
                    name="normalPrice"
                    value={formData.normalPrice}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Price
                  </label>
                  <input
                    type="number"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00 (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Product is active
                  </label>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Images *
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({allImages.length}/5)
                </span>
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                  <p className="text-xs text-gray-500 mb-4">Maximum 5 images allowed</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={allImages.length >= 5}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      allImages.length >= 5
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Browse Files
                  </label>
                </div>

                {/* Image Previews */}
                {allImages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {allImages.length} images selected
                      {existingImages.length > 0 && (
                        <span className="text-gray-400 ml-2">
                          ({existingImages.length} existing, {images.length} new)
                        </span>
                      )}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {allImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id, image.type)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                          {image.type === 'existing' && (
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                              Existing
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

              <div className="space-y-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="0.5kg"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                      >
                        Add
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateProductMutation.isPending}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {updateProductMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating Product...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Update Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;