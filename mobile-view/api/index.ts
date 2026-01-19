import axiosInstance from './client';

// Products API
export const getProducts = async () => {
  const { data } = await axiosInstance.get('/products');
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

export const getProductsByCategory = async (category: string) => {
  const { data } = await axiosInstance.get(`/products/category/${category}`);
  return data;
};

// Orders API
export const createOrder = async (orderData: any) => {
  const { data } = await axiosInstance.post('/orders', orderData);
  return data;
};

export const getUserOrders = async () => {
  const { data } = await axiosInstance.get('/orders');
  return data;
};

export const trackOrder = async (orderId: string) => {
  const { data } = await axiosInstance.get(`/orders/${orderId}/track`);
  return data;
};

// Users API
export const registerUser = async (userData: any) => {
  const { data } = await axiosInstance.post('/users/register', userData);
  return data;
};

export const loginUser = async (credentials: any) => {
  const { data } = await axiosInstance.post('/users/login', credentials);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await axiosInstance.get('/users/profile');
  return data;
};

export const updateUserProfile = async (userData: any) => {
  const { data } = await axiosInstance.put('/users/profile', userData);
  return data;
};

// Addresses API
export const getAddresses = async () => {
  const { data } = await axiosInstance.get('/users/address');
  return data;
};

export const addAddress = async (addressData: any) => {
  const { data } = await axiosInstance.post('/users/addresses', addressData);
  return data;
};

export const updateAddress = async (addressId: string, addressData: any) => {
  const { data } = await axiosInstance.put(`/users/addresses/${addressId}`, addressData);
  return data;
};

export const deleteAddress = async (addressId: string) => {
  const { data } = await axiosInstance.post(`/users/addresses/${addressId}`);
  return data;
};