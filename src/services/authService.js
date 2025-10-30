import { apiService } from '../config/api';
import { config } from '../config/env';

export const authService = {
  // Authentication methods
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    if (response.data.success && response.data.data) {
      this.setTokens(
        response.data.data.accessToken, 
        response.data.data.refreshToken, 
        response.data.data.role,
        response.data.data
      );
    }
    return response.data;
  },

  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await apiService.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Profile management
  async getProfile() {
    const response = await apiService.get('/auth/profile');
    if (response.data.success && response.data.data) {
      this.updateUserData(response.data.data);
    }
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiService.put('/auth/profile', profileData);
    if (response.data.success && response.data.data) {
      this.updateUserData(response.data.data);
    }
    return response.data;
  },

  // Token management
  setTokens(accessToken, refreshToken, role, userData = null) {
    sessionStorage.setItem(config.AUTH_TOKEN_KEY, accessToken);
    sessionStorage.setItem(config.REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.setItem('userRole', role);
    
    if (userData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
  },

  getAccessToken() {
    return sessionStorage.getItem(config.AUTH_TOKEN_KEY);
  },

  getRefreshToken() {
    return sessionStorage.getItem(config.REFRESH_TOKEN_KEY);
  },

  getRole() {
    return sessionStorage.getItem('userRole');
  },

  getUserData() {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  clearTokens() {
    sessionStorage.removeItem(config.AUTH_TOKEN_KEY);
    sessionStorage.removeItem(config.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userData');
  },

  isAuthenticated() {
    const token = sessionStorage.getItem(config.AUTH_TOKEN_KEY);
    return !!token;
  },

  isAdmin() {
    const role = sessionStorage.getItem('userRole');
    return role === 'ADMIN';
  },

  getCurrentUser() {
    const token = sessionStorage.getItem(config.AUTH_TOKEN_KEY);
    const role = sessionStorage.getItem('userRole');
    const userData = this.getUserData();
    
    if (!token) return null;
    
    return {
      token,
      role,
      ...userData
    };
  },

  // Update user data in storage
  updateUserData(userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
};