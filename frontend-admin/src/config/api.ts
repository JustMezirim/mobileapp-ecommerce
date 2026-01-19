const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface ApiEndpoints {
  health: string;
  // Add more endpoints as needed
}

interface ApiConfig {
  baseURL: string;
  endpoints: ApiEndpoints;
}

export const apiConfig: ApiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    health: '/api/health',
    // Add more endpoints as needed
  }
};

// Helper function for making API calls
export const apiCall = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};


