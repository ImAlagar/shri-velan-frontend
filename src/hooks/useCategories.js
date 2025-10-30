// hooks/useCategories.js - UPDATED
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { toast } from 'react-hot-toast';

// Query keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
  stats: () => [...categoryKeys.all, 'stats'],
  active: () => [...categoryKeys.all, 'active'],
};

// Get category statistics
export const useCategoryStats = (options = {}) => {
  return useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoryService.getCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

// Get all categories (admin)
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

// Get active categories (public)
export const useActiveCategories = (options = {}) => {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: () => categoryService.getActiveCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Get single category
export const useCategory = (id, options = {}) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (data) => {
      toast.success(data.message || 'Category created successfully');
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create category';
      toast.error(message);
      
      // Don't redirect on mutation errors
      if (error.response?.status === 401) {
        console.warn('Unauthorized - Please login again');
      }
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => categoryService.updateCategory(id, data),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Category updated successfully');
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (data, id) => {
      toast.success(data.message || 'Category deleted successfully');
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete category';
      toast.error(message);
    },
  });
};

// Toggle category status mutation
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => categoryService.toggleCategoryStatus(id, isActive),
    onSuccess: (data, variables) => {
      const status = variables.isActive ? 'activated' : 'deactivated';
      toast.success(`Category ${status} successfully`);
      
      queryClient.setQueryData(
        categoryKeys.detail(variables.id),
        (old) => old ? { ...old, isActive: variables.isActive } : old
      );
      
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update category status';
      toast.error(message);
    },
  });
};