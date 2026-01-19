import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export const setAuthToken = (getToken: () => Promise<string | null>) => {
  getTokenFn = getToken;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (getTokenFn) {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('[TOKEN ERROR]', error);
    }
    console.log('[API REQUEST]', config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
