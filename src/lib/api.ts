import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

// Buat instance axios dengan baseURL
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use environment variable
  timeout: 60000, // Increase timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // If we can't decode the token, consider it expired
  }
};

// Create a separate axios instance for refresh token requests
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// Flag to track ongoing token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper function to process queued requests
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Helper function to add request to queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper function to refresh token
const refreshToken = async (): Promise<string | null> => {
  try {
    if (isRefreshing) {
      // Return a promise that resolves when the token is refreshed
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          resolve(token);
        });
      });
    }

    isRefreshing = true;

    // Get the current token from localStorage
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      throw new Error('No token available');
    }
    
    const response = await refreshClient.post('/auth/refresh', {
      token: currentToken
    });
    
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    
    isRefreshing = false;
    onRefreshed(access_token);
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    isRefreshing = false;
    refreshSubscribers = [];
    return null;
  }
};

// Helper function to handle logout
const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user_id');
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token check for login and refresh requests
    if (config.url === '/auth/login' || config.url === '/auth/refresh') {
      return config;
    }
    
    let token = localStorage.getItem('token');
    
    // Check if token exists and is expired
    if (token) {
      if (isTokenExpired(token)) {
        // Try to refresh token before making the request
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
        } else {
          // If refresh failed, logout
          handleLogout();
          return Promise.reject(new Error('Session expired'));
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Untuk permintaan multipart/form-data, jangan atur Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response dan error
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Check if token is expired
        const currentToken = localStorage.getItem('token');
        if (currentToken && isTokenExpired(currentToken)) {
          // Try to refresh token
          const newToken = await refreshToken();
          if (newToken) {
            // Update Authorization header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request
            return apiClient(originalRequest);
          }
        }
        
        // If we reach here, either:
        // 1. No current token
        // 2. Token refresh failed
        // 3. Token not expired but server rejected it
        handleLogout();
      } catch (refreshError) {
        handleLogout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;