import axiosInstance from './client';

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    }
    return Promise.reject(error);
  }
);
