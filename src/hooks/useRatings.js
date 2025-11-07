// hooks/useRatings.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ratingService } from '../services/ratingService';

// Query keys
export const ratingKeys = {
  all: ['ratings'],
  lists: () => [...ratingKeys.all, 'list'],
  list: (filters) => [...ratingKeys.lists(), filters],
  details: () => [...ratingKeys.all, 'detail'],
  detail: (id) => [...ratingKeys.details(), id],
  product: (productId) => [...ratingKeys.all, 'product', productId],
  userProduct: (userId, productId) => [...ratingKeys.all, 'user', userId, 'product', productId],
  stats: (productId) => [...ratingKeys.all, 'stats', productId],
};

// Get all ratings (admin)
export const useRatings = (params = {}) => {
  return useQuery({
    queryKey: ratingKeys.list(params),
    queryFn: () => ratingService.getRatings(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get product ratings
export const useProductRatings = (productId) => {
  return useQuery({
    queryKey: ratingKeys.product(productId),
    queryFn: () => ratingService.getProductRatings(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user's rating for a product
export const useUserProductRating = (userId, productId) => {
  return useQuery({
    queryKey: ratingKeys.userProduct(userId, productId),
    queryFn: () => ratingService.getUserProductRating(productId, userId),
    enabled: !!userId && !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get product rating statistics
export const useProductRatingStats = (productId) => {
  return useQuery({
    queryKey: ratingKeys.stats(productId),
    queryFn: () => ratingService.getProductRatingStats(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create rating mutation
export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingData) => ratingService.createRating(ratingData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ratingKeys.product(variables.productId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: ratingKeys.userProduct(variables.userId, variables.productId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: ratingKeys.stats(variables.productId) 
      });
      
      toast.success(data.message || 'Rating submitted successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to submit rating';
      toast.error(errorMessage);
    },
  });
};

// Update rating status mutation
export const useUpdateRatingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isApproved }) => ratingService.updateRatingStatus(id, isApproved),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ratingKeys.detail(variables.id) });
      toast.success('Rating status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update rating status');
    },
  });
};

// Delete rating mutation
export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ratingService.deleteRating(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
      toast.success('Rating deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete rating');
    },
  });
};