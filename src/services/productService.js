// services/productService.js
import { apiService } from '../config/api';

export const productService = {
  // Get product statistics
  async getProductStats() {
    try {
      const response = await apiService.get('/products/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Product stats error:', error);
      throw error;
    }
  },

  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      const response = await apiService.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Get single product
  async getProductById(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Create product
  async createProduct(productData) {
    try {
      const response = await apiService.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Create product error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await apiService.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Update product error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const response = await apiService.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Get filtered products by category
  async getFilteredProductsByCategory(categoryId, queryString) {
    try {
      const response = await apiService.get(`/products/category/${categoryId}/filter?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Get filtered products error:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(params = {}) {
    try {
      const response = await apiService.get('/products/featured/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },

  // Get combo products
  async getComboProducts(params = {}) {
    try {
      const response = await apiService.get('/products/combo/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get combo products error:', error);
      throw error;
    }
  },

  // Get products by tags
  async getProductsByTags(params = {}) {
    try {
      const response = await apiService.get('/products/tagged/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get products by tags error:', error);
      throw error;
    }
  },

  // Get best selling products
  async getBestSellingProducts(params = {}) {
    try {
      const response = await apiService.get('/products/bestselling/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get best selling products error:', error);
      throw error;
    }
  },

  // Toggle featured status
  async toggleFeatured(id, isFeatured) {
    try {
      const response = await apiService.patch(`/products/${id}/featured`, { isFeatured });
      return response.data;
    } catch (error) {
      console.error('Toggle featured error:', error);
      throw error;
    }
  },

  // Add product images
  async addProductImages(id, images) {
    try {
      const formData = new FormData();
      images.forEach(file => {
        formData.append('images', file);
      });

      const response = await apiService.post(`/products/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Add product images error:', error);
      throw error;
    }
  },

  // Delete product image
  async deleteProductImage(id, imageIndex) {
    try {
      const response = await apiService.delete(`/products/${id}/images/${imageIndex}`);
      return response.data;
    } catch (error) {
      console.error('Delete product image error:', error);
      throw error;
    }
  },

  // Update product image order
  async updateProductImageOrder(id, imageOrder) {
    try {
      const response = await apiService.put(`/products/${id}/image-order`, { imageOrder });
      return response.data;
    } catch (error) {
      console.error('Update product image order error:', error);
      throw error;
    }
  }
};