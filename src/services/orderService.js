import { apiService } from '../config/api';

export const orderService = {
  // Create Razorpay order
  async createRazorpayOrder(orderData) {
    try {
      const response = await apiService.post('/orders/create-payment-order', orderData);
      return response.data;
    } catch (error) {
      console.error('Create Razorpay order error:', error);
      throw error;
    }
  },

  // Verify payment and create order
  async verifyPaymentAndCreateOrder(paymentData) {
    try {
      const response = await apiService.post('/orders/verify-payment', paymentData);
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  // Get all orders (Admin)
  async getOrders(params = {}) {
    try {
      const response = await apiService.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

    async getOrderStats() {
    try {
      const response = await apiService.get('/orders/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  },

  // Get user orders
  async getUserOrders() {
    try {
      const response = await apiService.get('/orders/user');
      return response.data;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Get single order
  async getOrderById(id) {
    try {
      const response = await apiService.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const response = await apiService.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      const response = await apiService.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  },


    // Tracking methods
  async getTrackingInfo(orderId = null, trackingNumber = null) {
    try {
      const params = {};
      if (orderId) params.orderId = orderId;
      if (trackingNumber) params.trackingNumber = trackingNumber;

      const response = await apiService.get('/orders/tracking/info', { params });
      return response.data;
    } catch (error) {
      console.error('Get tracking info error:', error);
      throw error;
    }
  },

  async publicTracking(trackingNumber, email) {
    try {
      const response = await apiService.post('/orders/tracking/public', {
        trackingNumber,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Public tracking error:', error);
      throw error;
    }
  },

  async getTrackingHistory(orderId) {
    try {
      const response = await apiService.get(`/orders/${orderId}/tracking/history`);
      return response.data;
    } catch (error) {
      console.error('Get tracking history error:', error);
      throw error;
    }
  },

  async updateTracking(orderId, trackingData) {
    try {
      const response = await apiService.put(`/orders/${orderId}/tracking`, trackingData);
      return response.data;
    } catch (error) {
      console.error('Update tracking error:', error);
      throw error;
    }
  },

  async addTrackingEvent(orderId, eventData) {
    try {
      const response = await apiService.post(`/orders/${orderId}/tracking/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Add tracking event error:', error);
      throw error;
    }
  },

    async getShippingCarriers() {
    try {
      // For now, return a static list of carriers
      // You can replace this with an API call if you have a backend endpoint
      return {
        data: [
          { code: 'fedex', name: 'FedEx' },
          { code: 'ups', name: 'UPS' },
          { code: 'dhl', name: 'DHL' },
          { code: 'usps', name: 'USPS' },
          { code: 'bluedart', name: 'Blue Dart' },
          { code: 'delhivery', name: 'Delhivery' },
          { code: 'custom', name: 'Custom Carrier' }
        ]
      };
    } catch (error) {
      console.error('Get shipping carriers error:', error);
      throw error;
    }
  },
};  