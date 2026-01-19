import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory, 
  createOrder, 
  getUserOrders,
  trackOrder,
  loginUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../api';

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });
};

// Orders hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
  });
};

export const useTrackOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', 'track', orderId],
    queryFn: () => trackOrder(orderId),
    enabled: !!orderId,
  });
};

// User hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

// Address hooks
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, addressData }: { addressId: string; addressData: any }) =>
      updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};