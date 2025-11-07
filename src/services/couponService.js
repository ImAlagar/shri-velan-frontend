import { apiService } from '../config/api';

export const couponService = {
  // Get all coupons (Admin)
  async getCoupons(params = {}) {
    try {
      const response = await apiService.get('/coupons', { params });
      return response.data;
    } catch (error) {
      console.error('Get coupons error:', error);
      throw error;
    }
  },

  // Get single coupon (Admin)
  async getCouponById(id) {
    try {
      const response = await apiService.get(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get coupon by ID error:', error);
      throw error;
    }
  },

  // Create coupon (Admin)
  async createCoupon(couponData) {
    try {
      const response = await apiService.post('/coupons', couponData);
      return response.data;
    } catch (error) {
      console.error('Create coupon error:', error);
      throw error;
    }
  },

    async getAvailableCoupons(subtotal = 0) {
    const response = await apiService.get(`/coupons/available?subtotal=${subtotal}`);
    return response.data;
  },

    // Validate coupon (Public)
  async validateCoupon(code, subtotal) {
    try {
      const response = await apiService.post('/coupons/validate', { 
        code, 
        subtotal 
      });
      return response.data;
    } catch (error) {
      console.error('Validate coupon error:', error);
      throw error;
    }
  },
  // Update coupon (Admin)
  async updateCoupon(id, couponData) {
    try {
      const response = await apiService.put(`/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      console.error('Update coupon error:', error);
      throw error;
    }
  },

  // Delete coupon (Admin)
  async deleteCoupon(id) {
    try {
      const response = await apiService.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete coupon error:', error);
      throw error;
    }
  },


};