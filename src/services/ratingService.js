// services/ratingService.js - UPDATED
import { apiService } from '../config/api';

export const ratingService = {
  // Create rating
  async createRating(ratingData) {
    try {
      // Transform data to match backend expectations
      const backendData = {
        ...ratingData,
        review: ratingData.comment // Map comment to review for backend
      };
      
      // Remove comment field to avoid confusion
      delete backendData.comment;

      const response = await apiService.post('/ratings', backendData);
      return response.data;
    } catch (error) {
      console.error('Create rating error:', error);
      throw error;
    }
  },

  // Get ratings (for admin with pagination and filters)
  async getRatings(params = {}) {
    try {
      const response = await apiService.get('/ratings', { params });
      return response.data;
    } catch (error) {
      console.error('Get ratings error:', error);
      throw error;
    }
  },

  // Get product ratings
  async getProductRatings(productId) {
    try {
      const response = await apiService.get(`/ratings/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Get product ratings error:', error);
      throw error;
    }
  },

  // Update rating status (approve/reject)
  async updateRatingStatus(id, isApproved) {
    try {
      const response = await apiService.put(`/ratings/${id}/status`, { isApproved });
      return response.data;
    } catch (error) {
      console.error('Update rating status error:', error);
      throw error;
    }
  },

  // Delete rating
  async deleteRating(id) {
    try {
      const response = await apiService.delete(`/ratings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete rating error:', error);
      throw error;
    }
  },

  // Get user's rating for a product (to check if already rated)
  async getUserProductRating(productId, userId) {
    try {
      const response = await apiService.get(`/ratings/user/${userId}/product/${productId}`);
      return response.data;
    } catch (error) {
      // If 404, return null (user hasn't rated yet)
      if (error.response?.status === 404) {
        return { data: null };
      }
      console.error('Get user product rating error:', error);
      throw error;
    }
  },

  // Get rating statistics for a product
  async getProductRatingStats(productId) {
    try {
      const response = await apiService.get(`/ratings/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get product rating stats error:', error);
      throw error;
    }
  }
};