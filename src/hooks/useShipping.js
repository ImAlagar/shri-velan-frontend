import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { shippingService } from '../services/shippingService';

// Query keys
export const shippingKeys = {
  all: ['shipping'],
  lists: () => [...shippingKeys.all, 'list'],
  list: (filters) => [...shippingKeys.lists(), filters],
  details: () => [...shippingKeys.all, 'detail'],
  detail: (id) => [...shippingKeys.details(), id],
  calculate: () => [...shippingKeys.all, 'calculate'],
  calculateOrder: () => [...shippingKeys.all, 'calculate-order'],

};

// Calculate shipping (Public)
export const useCalculateShipping = () => {
  return useMutation({
    mutationFn: (shippingData) => shippingService.calculateShipping(shippingData),
    onError: (error) => {
      // Error handling is done in the component
    },
  });
};

// Calculate order shipping (Public) - NEW
export const useCalculateOrderShipping = () => {
  return useMutation({
    mutationFn: (orderData) => shippingService.calculateOrderShipping(orderData),
    onError: (error) => {
      // Error handling is done in the component
    },
  });
};

// Get all shipping rates (Admin)
export const useShippingRates = (params = {}) => {
  return useQuery({
    queryKey: shippingKeys.list(params),
    queryFn: () => shippingService.getShippingRates(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Create shipping rate mutation (Admin)
export const useCreateShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rateData) => shippingService.createShippingRate(rateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.lists() });
      toast.success(data.message || 'Shipping rate created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create shipping rate';
      toast.error(errorMessage);
    },
  });
};

// Update shipping rate mutation (Admin)
export const useUpdateShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...rateData }) => shippingService.updateShippingRate(id, rateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shippingKeys.detail(variables.id) });
      toast.success(data.message || 'Shipping rate updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update shipping rate');
    },
  });
};

// Delete shipping rate mutation (Admin)
export const useDeleteShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => shippingService.deleteShippingRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.lists() });
      toast.success('Shipping rate deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete shipping rate');
    },
  });
};