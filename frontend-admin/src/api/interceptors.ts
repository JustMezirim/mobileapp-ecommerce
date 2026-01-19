import axiosInstance from './client';
import type { InternalAxiosRequestConfig } from 'axios';

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (window.Clerk?.session) {
      const token: string | null = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
