import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getAllProducts, createProduct, updateProduct, deleteProduct, bulkDeleteProducts, bulkUpdateProductStatus, getAllOrders, updateOrderStatus, bulkUpdateOrderStatus, getAllCustomers, deleteCustomer, bulkDeleteCustomers, getDashboardStats } from '../api/admin';
import { handleMutationError } from '@/utils/errorHandler';

// Type definitions for API responses and request parameters
interface Product {
  id: string | number;
  [key: string]: any;
}

interface Order {
  id: string | number;
  status: string;
  [key: string]: any;
}

interface Customer {
  id: string | number;
  [key: string]: any;
}

interface DashboardStats {
  [key: string]: any;
}

interface UpdateProductParams {
  id: string | number;
  formData: FormData | any;
}

interface UpdateOrderStatusParams {
  orderId: string | number;
  status: string;
}

// Products hooks
export const useProducts = (): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProducts,
  });
};

export const useCreateProduct = (): UseMutationResult<any, Error, FormData | any, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useUpdateProduct = (): UseMutationResult<any, Error, UpdateProductParams, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: UpdateProductParams) => updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useDeleteProduct = (): UseMutationResult<any, Error, string | number, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useBulkDeleteProducts = (): UseMutationResult<any, Error, string[], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useBulkUpdateProductStatus = (): UseMutationResult<any, Error, { productIds: string[], status: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productIds, status }) => bulkUpdateProductStatus(productIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

// Orders hooks
export const useOrders = (): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });
};

export const useUpdateOrderStatus = (): UseMutationResult<any, Error, UpdateOrderStatusParams, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: UpdateOrderStatusParams) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useBulkUpdateOrderStatus = (): UseMutationResult<any, Error, { orderIds: string[], status: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderIds, status }) => bulkUpdateOrderStatus(orderIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

// Customers hooks
export const useCustomers = (): UseQueryResult<Customer[], Error> => {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: getAllCustomers,
  });
};

export const useDeleteCustomer = (): UseMutationResult<any, Error, string | number, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

export const useBulkDeleteCustomers = (): UseMutationResult<any, Error, string[], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteCustomers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
    onError: (error: Error) => {
      handleMutationError(error);
    },
  });
};

// Dashboard hooks
export const useDashboardStats = (): UseQueryResult<DashboardStats, Error> => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Auto-refetch every 30 seconds
    staleTime: 0, // Always consider data stale for realtime updates
  });
};
