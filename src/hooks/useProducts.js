// hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productService } from '../services/productService';
import { useNavigate } from 'react-router-dom';

// Query keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
  stats: () => [...productKeys.all, 'stats'],
};

// Get product statistics
export const useProductStats = () => {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productService.getProductStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all products
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFilteredProductsByCategory = (categoryId, filters = {}, options = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filter parameters
  if (filters.minPrice !== undefined) {
    queryParams.append('minPrice', filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    queryParams.append('maxPrice', filters.maxPrice);
  }
  
  if (filters.inStock) {
    queryParams.append('inStock', 'true');
  }
  
  if (filters.onSale) {
    queryParams.append('onSale', 'true');
  }
  
  if (filters.ratings && filters.ratings.length > 0) {
    queryParams.append('ratings', filters.ratings.join(','));
  }
  
  if (filters.sortBy) {
    queryParams.append('sortBy', filters.sortBy);
  }

  if (filters.page) {
    queryParams.append('page', filters.page);
  }

  if (filters.limit) {
    queryParams.append('limit', filters.limit);
  }

  return useQuery({
    queryKey: ['filteredProducts', categoryId, filters],
    queryFn: () => productService.getFilteredProductsByCategory(categoryId, queryParams.toString()),
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // You might need to use useNavigate in the component instead

  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      toast.success(data.message || 'Product created successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      toast.error(errorMessage);
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await productService.updateProduct(id, data);
      console.log('🔄 Update service response:', response);
      return response; // Make sure to return the response
    },
    onSuccess: (data, variables) => {
      console.log('🎯 Update mutation onSuccess:', data);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      
      // Only show toast if we have a success message from backend
      if (data && data.message) {
        toast.success(data.message);
      } else {
        toast.success('Product updated successfully');
      }
    },
    onError: (error) => {
      console.error('💥 Update mutation onError:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast.error(errorMessage);
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

// Toggle product status mutation
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => productService.updateProduct(id, { status }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      toast.success(`Product ${variables.status ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product status');
    },
  });
};