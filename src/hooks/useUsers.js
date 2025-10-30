// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { showSuccess, showError, showPromise } from '../utils/toast'; // Import toast utilities

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  stats: () => [...userKeys.all, 'stats'],
};

// Get user statistics
export const useUserStats = (options = {}) => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      showError('Failed to load user statistics');
    },
    ...options,
  });
};

// Get all users (admin)
export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...userKeys.lists(), params],
    queryFn: () => userService.getAllUsers(params),
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      showError('Failed to load users');
    },
    ...options,
  });
};

// Get single user
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showError('Failed to load user details');
    },
    ...options,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: (data) => {
      showSuccess(data.message || 'User created successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create user';
      showError(message);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      showSuccess(data.message || 'User updated successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update user';
      showError(message);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (data, id) => {
      showSuccess(data.message || 'User deleted successfully');
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete user';
      showError(message);
    },
  });
};

// Toggle user status mutation
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => userService.toggleUserStatus(id, isActive),
    onSuccess: (data, variables) => {
      const status = variables.isActive ? 'activated' : 'deactivated';
      showSuccess(`User ${status} successfully`);
      
      queryClient.setQueryData(
        userKeys.detail(variables.id),
        (old) => old ? { ...old, isActive: variables.isActive } : old
      );
      
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update user status';
      showError(message);
    },
  });
};