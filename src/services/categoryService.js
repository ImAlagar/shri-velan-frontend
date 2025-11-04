// services/categoryService.js - UPDATED with better error handling
import { apiService } from '../config/api';

export const categoryService = {
  // Get category statistics
  async getCategoryStats() {
    try {
      const response = await apiService.get('/categories/stats');
      return response.data;
    } catch (error) {
      console.error('Category stats error:', error);
      throw error;
    }
  },


  async getAllCategories() {
    try {
      const response = await apiService.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Get all categories error:', error);
      throw error;
    }
  },

  // Get active categories (public)
  async getActiveCategories() {
    try {
      const response = await apiService.get('/categories/active');
      return response.data;
    } catch (error) {
      console.error('Get active categories error:', error);
      throw error;
    }
  },

  // Get single category
  async getCategoryById(id) {
    try {
      const response = await apiService.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw error;
    }
  },

  // Create category
  async createCategory(categoryData) {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          formData.append(key, categoryData[key]);
        }
      });

      const response = await apiService.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const formData = new FormData();
      
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          formData.append(key, categoryData[key]);
        }
      });

      const response = await apiService.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await apiService.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  },

  // Toggle category status
  async toggleCategoryStatus(id, isActive) {
    try {
      const response = await apiService.patch(`/categories/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Toggle category status error:', error);
      throw error;
    }
  }
};