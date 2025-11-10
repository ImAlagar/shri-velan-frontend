import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  
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
    preparingMethods: [], // ✅ ADD PREPARING METHODS ARRAY
    tags: [],
    stock: 0,
    status: true
  });

  const [images, setImages] = useState([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [preparingMethodInput, setPreparingMethodInput] = useState(''); // ✅ ADD PREPARING METHOD INPUT
  const [tagInput, setTagInput] = useState('');

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data || [];

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
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
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
    
    // Enhanced validation
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
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    try {
      // Create FormData object
      const submitData = new FormData();
      
      // Append all required fields
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('categoryId', formData.categoryId);
      submitData.append('normalPrice', formData.normalPrice.toString());
      submitData.append('stock', formData.stock.toString());
      
      // Append optional fields only if they have values
      if (formData.weight) {
        submitData.append('weight', formData.weight);
      }
      
      submitData.append('isCombo', formData.isCombo.toString());
      submitData.append('isFeatured', formData.isFeatured.toString()); // ✅ ADD ISFEATURED
      submitData.append('status', formData.status.toString());
      
      if (formData.offerPrice && formData.offerPrice > 0) {
        submitData.append('offerPrice', formData.offerPrice.toString());
      }
      
      // Append arrays as individual entries
      formData.benefits.forEach(benefit => {
        submitData.append('benefits', benefit);
      });
      
      formData.ingredients.forEach(ingredient => {
        submitData.append('ingredients', ingredient);
      });
      
      // ✅ APPEND PREPARING METHODS
      formData.preparingMethods.forEach(method => {
        submitData.append('preparingMethods', method);
      });
      
      formData.tags.forEach(tag => {
        submitData.append('tags', tag);
      });
      
      // Append images
      images.forEach(image => {
        submitData.append('images', image.file);
      });

      // Log FormData entries for verification
      for (let [key, value] of submitData.entries()) {
        if (key === 'images') {
          console.log(`  ${key}:`, 'File object');
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      // Call the mutation
      await createProductMutation.mutateAsync(submitData);
      
      toast.success('Product created successfully!');
      navigate('/admin/products');
      
    } catch (error) {
      console.error('❌ Product creation failed:', error);
      // Don't show toast here as it's handled in the mutation
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="p-2">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Add a new product to your store</p>
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

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a benefit"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add an ingredient"
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={preparingMethodInput}
                      onChange={(e) => setPreparingMethodInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreparingMethod())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a preparation method"
                    />
                    <button
                      type="button"
                      onClick={addPreparingMethod}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Methods List */}
                {formData.preparingMethods.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images *</h3>
              
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
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {images.length} of 5 images selected
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping & Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.5kg"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            {createProductMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding Product...</span>
              </>
            ) : (
              <span>Add Product</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;