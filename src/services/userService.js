// services/userService.js
import { apiService } from '../config/api';

export const userService = {
  // Get user statistics
  async getUserStats() {
    try {
      const response = await apiService.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('User stats error:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  async getAllUsers(params = {}) {
    try {
      const response = await apiService.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // Get single user
  async getUserById(id) {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  // Create user
  async createUser(userData) {
    try {
      const response = await apiService.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await apiService.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const response = await apiService.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // Toggle user status
  async toggleUserStatus(id, isActive) {
    try {
      const response = await apiService.patch(`/users/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  }
};