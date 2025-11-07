import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { couponService } from '../services/couponService';

// Query keys
export const couponKeys = {
  all: ['coupons'],
  lists: () => [...couponKeys.all, 'list'],
  list: (filters) => [...couponKeys.lists(), filters],
  details: () => [...couponKeys.all, 'detail'],
  detail: (id) => [...couponKeys.details(), id],
};

// Get all coupons (Admin)
export const useCoupons = (params = {}) => {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponService.getCoupons(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Get single coupon (Admin)
export const useCoupon = (id) => {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponService.getCouponById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create coupon mutation (Admin)
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData) => couponService.createCoupon(couponData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      toast.success(data.message || 'Coupon created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create coupon';
      toast.error(errorMessage);
    },
  });
};

// Update coupon mutation (Admin)
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...couponData }) => couponService.updateCoupon(id, couponData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
      toast.success(data.message || 'Coupon updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
};

// Delete coupon mutation (Admin)
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => couponService.deleteCoupon(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      toast.success(data.message || 'Coupon deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
};

export const useAvailableCoupons = (subtotal = 0) => {
  return useQuery({
    queryKey: ['availableCoupons', subtotal],
    queryFn: async () => {
      const response = await couponService.getAvailableCoupons(subtotal);
      return response.data;
    },
    enabled: subtotal > 0, // Only fetch if there's a subtotal
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// Validate coupon mutation (Public)
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ code, subtotal }) => couponService.validateCoupon(code, subtotal),
    onError: (error) => {
      // Error handling is done in the component
      console.error('Coupon validation error:', error);
    },
  });
};