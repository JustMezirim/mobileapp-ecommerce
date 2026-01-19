import axiosInstance from './client';

// Products API
export const getAllProducts = async () => {
  const { data } = await axiosInstance.get('/api/admin/products');
  return data;
};

export const createProduct = async (formData: FormData) => {
  const { data } = await axiosInstance.post('/api/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateProduct = async (id: string | number, formData: FormData) => {
  const { data } = await axiosInstance.put(`/api/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteProduct = async (id: string | number) => {
  const { data } = await axiosInstance.delete(`/api/admin/products/${id}`);
  return data;
};

export const bulkDeleteProducts = async (productIds: string[]) => {
  const { data } = await axiosInstance.post('/api/admin/products/bulk-delete', { productIds });
  return data;
};

export const bulkUpdateProductStatus = async (productIds: string[], status: string) => {
  const { data } = await axiosInstance.post('/api/admin/products/bulk-update', { productIds, status });
  return data;
};

// Orders API
export const getAllOrders = async () => {
  const { data } = await axiosInstance.get('/api/admin/orders');
  return data;
};

export const updateOrderStatus = async (orderId: string | number, status: string) => {
  const { data } = await axiosInstance.put(`/api/admin/orders/${orderId}`, { status });
  return data;
};

export const bulkUpdateOrderStatus = async (orderIds: string[], status: string) => {
  const { data } = await axiosInstance.post('/api/admin/orders/bulk-update', { orderIds, status });
  return data;
};

// Customers API
export const getAllCustomers = async () => {
  const { data } = await axiosInstance.get('/api/admin/customers');
  return data;
};

export const deleteCustomer = async (id: string | number) => {
  const { data } = await axiosInstance.delete(`/api/admin/customers/${id}`);
  return data;
};

export const bulkDeleteCustomers = async (customerIds: string[]) => {
  const { data } = await axiosInstance.post('/api/admin/customers/bulk-delete', { customerIds });
  return data;
};

// Dashboard API
export const getDashboardStats = async () => {
  const { data } = await axiosInstance.get('/api/admin/stats');
  return data;
};