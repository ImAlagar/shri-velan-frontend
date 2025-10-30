// services/contactService.js
import { apiService } from '../config/api';

export const contactService = {
  async getContactStats() {
    try {
      const response = await apiService.get('/contacts/stats');
      return response.data;
    } catch (error) {
      console.error('Contact stats error:', error);
      throw error;
    }
  },

  async getContacts(params = {}) {
    try {
      const response = await apiService.get('/contacts', { params });
      return response.data;
    } catch (error) {
      console.error('Get all contacts error:', error);
      throw error;
    }
  },

  async getContactById(id) {
    try {
      const response = await apiService.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get contact by ID error:', error);
      throw error;
    }
  },

  async createContact(contactData) {
    try {
      const response = await apiService.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Create contact error:', error);
      throw error;
    }
  },

  async updateContactStatus(id, status) {
    try {
      const statusMap = {
        'new': 'PENDING',
        'in-progress': 'IN_PROGRESS',
        'resolved': 'RESOLVED',
        'closed': 'CLOSED'
      };
      
      const backendStatus = statusMap[status] || status;
      
      const response = await apiService.put(`/contacts/${id}/status`, { 
        status: backendStatus 
      });
      return response.data;
    } catch (error) {
      console.error('Update contact status error:', error);
      throw error;
    }
  },

  async deleteContact(id) {
    try {
      const response = await apiService.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }
};

export default contactService;