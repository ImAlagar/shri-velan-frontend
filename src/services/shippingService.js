import { apiService } from '../config/api';

export const shippingService = {
  // Calculate shipping (Public)
  // Calculate shipping (Public)
  async calculateShipping(shippingData) {
    try {
      const response = await apiService.post('/shipping/calculate', shippingData);
      return response.data;
    } catch (error) {
      console.error('Calculate shipping error:', error);
      throw error;
    }
  },

  // Calculate order shipping (Public) - NEW
  async calculateOrderShipping(orderData) {
    try {
      const response = await apiService.post('/shipping/calculate-order', orderData);
      return response.data;
    } catch (error) {
      console.error('Calculate order shipping error:', error);
      throw error;
    }
  },

  // Get all shipping rates (Admin)
  async getShippingRates(params = {}) {
    try {
      const response = await apiService.get('/shipping', { params });
      return response.data;
    } catch (error) {
      console.error('Get shipping rates error:', error);
      throw error;
    }
  },

  // Create shipping rate (Admin)
  async createShippingRate(rateData) {
    try {
      const response = await apiService.post('/shipping', rateData);
      return response.data;
    } catch (error) {
      console.error('Create shipping rate error:', error);
      throw error;
    }
  },

  // Update shipping rate (Admin)
  async updateShippingRate(id, rateData) {
    try {
      const response = await apiService.put(`/shipping/${id}`, rateData);
      return response.data;
    } catch (error) {
      console.error('Update shipping rate error:', error);
      throw error;
    }
  },

  // Delete shipping rate (Admin)
  async deleteShippingRate(id) {
    try {
      const response = await apiService.delete(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete shipping rate error:', error);
      throw error;
    }
  }
};