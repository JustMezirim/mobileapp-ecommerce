import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const API_BASE_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
