// Type definitions for API error structure
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface ApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
  code?: string;
}

export const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError?.response?.data?.error) {
    return apiError.response.data.error;
  }
  if (apiError?.message) {
    return apiError.message;
  }
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown, _defaultMessage: string = 'Operation failed'): string => {
  const message = getErrorMessage(error);
  console.error('API Error:', error);
  
  // You can add toast notifications here later
  // toast.error(message);
  
  return message;
};

export const isNetworkError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return !apiError?.response && apiError?.code === 'ERR_NETWORK';
};

export const isAuthError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return apiError?.response?.status === 401 || apiError?.response?.status === 403;
};

export const isValidationError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return apiError?.response?.status === 400;
};

export const handleMutationError = (error: unknown, onError?: (message: string) => void): string => {
  const message = handleApiError(error);
  
  if (isAuthError(error)) {
    // Handle auth errors (redirect to login, etc.)
    console.log('Authentication error detected');
  }
  
  if (onError) {
    onError(message);
  }
  
  return message;
};
