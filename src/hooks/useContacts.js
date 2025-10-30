// hooks/useContacts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { showSuccess, showError } from '../utils/toast';

// Query keys
export const contactKeys = {
  all: ['contacts'],
  lists: () => [...contactKeys.all, 'list'],
  list: (filters) => [...contactKeys.lists(), { filters }],
  details: () => [...contactKeys.all, 'detail'],
  detail: (id) => [...contactKeys.details(), id],
  stats: () => [...contactKeys.all, 'stats'],
};

// Get contact statistics
export const useContactStats = (options = {}) => {
  return useQuery({
    queryKey: contactKeys.stats(),
    queryFn: () => contactService.getContactStats(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      showError('Failed to load contact statistics');
    },
    ...options,
  });
};

// Get all contacts (admin)
export const useContacts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...contactKeys.lists(), params],
    queryFn: () => contactService.getContacts(params),
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      showError('Failed to load contacts');
    },
    ...options,
  });
};

// Get single contact
export const useContact = (id, options = {}) => {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactService.getContactById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showError('Failed to load contact details');
    },
    ...options,
  });
};

// Update contact status mutation
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => contactService.updateContactStatus(id, status),
    onSuccess: (data, variables) => {
      showSuccess('Contact status updated successfully');
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update contact status';
      showError(message);
    },
  });
};

// Delete contact mutation
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactService.deleteContact,
    onSuccess: (data, id) => {
      showSuccess('Contact deleted successfully');
      queryClient.removeQueries({ queryKey: contactKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete contact';
      showError(message);
    },
  });
};