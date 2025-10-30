import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AuthLoader from "../Auth/AuthLoader";
import FormInput from "../Common/FormInput";
import FormTextarea from "../Common/FormTextarea";
import FormSelect from "../Common/FormSelect";
import FormCheckbox from "../Common/FormCheckbox";
import ImageUpload from "../Common/ImageUpload";
import DynamicInputList from "../Common/DynamicInputList";

export default function AddProducts({ setActiveTab, productData: productDataFromProps }) {
  const [benefits, setBenefits] = useState([""]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [productData, setProductData] = useState({
    isCombo: false,
    name: "",
    weight: "",
    normalPrice: "",
    offerPrice: "",
    ingredients: "",
    stock: "",
    status: true,
    tags: "",
    description: "",
    categoryId: "",
  });

  const location = useLocation();
  const getToken = () => sessionStorage.getItem("accessToken");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const response = await fetch("https://shri-velan-food.onrender.com/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          throw new Error("Invalid categories data format");
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        toast.error("Failed to fetch categories. Please try again later.");
      }
    };
    
    fetchCategories();
  }, []);

  // Prefill form when editing
  useEffect(() => {
    const product = productDataFromProps || location.state?.product;
    if (product) {
      setIsEditing(true);
      setEditingProductId(product.id);
      
      setProductData({
        isCombo: product.isCombo || false,
        name: product.name || "",
        weight: product.weight || "",
        normalPrice: product.normalPrice || "",
        offerPrice: product.offerPrice || "",
        ingredients: product.ingredients?.join(", ") || "",
        stock: product.stock || "",
        status: product.status !== undefined ? product.status : true,
        tags: product.tags?.join(", ") || "",
        description: product.description || "",
        categoryId: product.category?.id || "",
      });

      setBenefits(product.benefits?.length > 0 ? product.benefits : [""]);
      
      if (product.images?.length > 0) {
        setExistingImages(product.images);
      }
    }
  }, [productDataFromProps, location.state]);

  // Handle file operations
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
    
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemovePreview = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBenefitChange = (index, value) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const addBenefit = () => setBenefits(prev => [...prev, ""]);
  const removeBenefit = (index) => setBenefits(prev => prev.filter((_, i) => i !== index));

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      toast.error("No authorization token found. Please login again.");
      return;
    }

    // Validation
    if (!productData.name || !productData.weight || !productData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    
    // Append files
    files.forEach((file) => formData.append("images", file));

    // Process arrays
    const ingredientsArray = productData.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);
    
    const tagsArray = productData.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    // Append product data
    Object.keys(productData).forEach(key => {
      if (key !== 'ingredients' && key !== 'tags') {
        formData.append(key, productData[key]);
      }
    });

    formData.append("ingredients", JSON.stringify(ingredientsArray));
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("benefits", JSON.stringify(benefits.filter(b => b.trim())));

    if (isEditing) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      setLoading(true);
      
      const url = isEditing 
        ? `https://shri-velan-food.onrender.com/api/products/${editingProductId}`
        : "https://shri-velan-food.onrender.com/api/products";
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'add'} product`);
      }

      toast.success(`✅ Product ${isEditing ? "updated" : "added"} successfully!`);
      
      if (!isEditing) {
        resetForm();
      } else if (typeof setActiveTab === "function") {
        setActiveTab("All Products");
      }
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductData({
      isCombo: false,
      name: "",
      weight: "",
      normalPrice: "",
      offerPrice: "",
      ingredients: "",
      stock: "",
      status: true,
      tags: "",
      description: "",
      categoryId: "",
    });
    setBenefits([""]);
    setFiles([]);
    setFilePreviews([]);
    setExistingImages([]);
    setIsEditing(false);
    setEditingProductId(null);
  };

  const activeCategories = categories.filter(cat => cat.isActive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? "Update your product information below"
            : "Fill in the details to add a new product to your store"
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
          <ImageUpload
            label="Upload product images (multiple images supported)"
            existingImages={existingImages}
            filePreviews={filePreviews}
            onFileChange={handleFileChange}
            onRemoveExisting={handleRemoveExistingImage}
            onRemovePreview={handleRemovePreview}
          />
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput
              label="Product Name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
            
            <FormInput
              label="Weight"
              name="weight"
              value={productData.weight}
              onChange={handleChange}
              placeholder="e.g., 500g, 1kg"
              required
            />
            
            <FormSelect
              label="Category"
              name="categoryId"
              value={productData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
            
            <FormCheckbox
              label="Is this a combo product?"
              name="isCombo"
              checked={productData.isCombo}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput
              label="Normal Price (₹)"
              name="normalPrice"
              type="number"
              value={productData.normalPrice}
              onChange={handleChange}
              placeholder="Enter normal price"
              required
              min="0"
              step="0.01"
            />
            
            <FormInput
              label="Offer Price (₹)"
              name="offerPrice"
              type="number"
              value={productData.offerPrice}
              onChange={handleChange}
              placeholder="Enter offer price"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits</h2>
          <DynamicInputList
            label="Product Benefits"
            items={benefits}
            onAdd={addBenefit}
            onRemove={removeBenefit}
            onChange={handleBenefitChange}
            placeholder="Enter benefit"
            addButtonText="Add Benefit"
          />
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FormInput
              label="Ingredients (comma separated)"
              name="ingredients"
              value={productData.ingredients}
              onChange={handleChange}
              placeholder="e.g., Almonds, Cashews, Jaggery"
              required
            />
            
            <FormInput
              label="Stock Quantity"
              name="stock"
              type="number"
              value={productData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              required
              min="0"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FormInput
              label="Tags (comma separated)"
              name="tags"
              value={productData.tags}
              onChange={handleChange}
              placeholder="e.g., health drink, malt, organic"
            />
            
            <FormCheckbox
              label="Product Status (Active/Inactive)"
              name="status"
              checked={productData.status}
              onChange={handleChange}
            />
          </div>
          
          <FormTextarea
            label="Product Description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Enter detailed product description..."
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <AuthLoader />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update Product" : "Add Product"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}