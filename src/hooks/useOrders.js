import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { orderService } from '../services/orderService';

// Query keys
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), filters],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  user: () => [...orderKeys.all, 'user'],
};

// Get all orders (Admin)
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.getOrders(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Get user orders
export const useUserOrders = () => {
  return useQuery({
    queryKey: orderKeys.user(),
    queryFn: () => orderService.getUserOrders(),
    staleTime: 2 * 60 * 1000,
  });
};

// Get single order
export const useOrder = (id) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: () => orderService.getOrderStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Razorpay order mutation
export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: (orderData) => orderService.createRazorpayOrder(orderData),
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create payment order';
      toast.error(errorMessage);
    },
  });
};

// Verify payment and create order mutation
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData) => orderService.verifyPaymentAndCreateOrder(paymentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.user() });
      toast.success(data.message || 'Order placed successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Payment verification failed';
      toast.error(errorMessage);
    },
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      toast.success(data.message || 'Order status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};

// Delete order mutation
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    },
  });
};

// Tracking hooks
export const useTrackingInfo = (orderId = null, trackingNumber = null) => {
  return useQuery({
    queryKey: ['tracking', orderId, trackingNumber],
    queryFn: () => orderService.getTrackingInfo(orderId, trackingNumber),
    enabled: !!(orderId || trackingNumber),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePublicTracking = () => {
  return useMutation({
    mutationFn: ({ trackingNumber, email }) => 
      orderService.publicTracking(trackingNumber, email),
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to fetch tracking information';
      toast.error(errorMessage);
    },
  });
};

export const useTrackingHistory = (orderId) => {
  return useQuery({
    queryKey: ['tracking-history', orderId],
    queryFn: () => orderService.getTrackingHistory(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, trackingData }) => 
      orderService.updateTracking(orderId, trackingData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tracking', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success(data.message || 'Tracking information updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update tracking information');
    },
  });
};

export const useAddTrackingEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, eventData }) => 
      orderService.addTrackingEvent(orderId, eventData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tracking-history', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['tracking', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success(data.message || 'Tracking event added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add tracking event');
    },
  });
};

// Add the missing useShippingCarriers hook
export const useShippingCarriers = () => {
  return useQuery({
    queryKey: ['shipping-carriers'],
    queryFn: () => orderService.getShippingCarriers(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};