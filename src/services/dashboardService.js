import { apiService } from "../config/api";

export const dashboardService = {
  getDashboardStats: async (timeRange = 'month') => {
    const response = await apiService.get(`/dashboard/stats?timeRange=${timeRange}`);
    return response.data;
  },

  getRecentActivities: async (limit = 10) => {
    const response = await apiService.get(`/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  getChartData: async (timeRange = 'month', chartType) => {
    const params = new URLSearchParams({ timeRange });
    if (chartType) params.append('chartType', chartType);
    
    const response = await apiService.get(`/dashboard/charts?${params}`);
    return response.data;
  }
};