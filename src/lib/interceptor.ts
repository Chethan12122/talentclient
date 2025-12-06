// lib/interceptor.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// Client-side cookie helper
const getClientCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const cookies = document.cookie.split(';');
    console.log("🍪 All cookies:", document.cookie);
    
    const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
    if (cookie) {
      const value = cookie.split('=').slice(1).join('=');
      const decodedValue = decodeURIComponent(value);
      console.log(`🍪 Found ${name} cookie:`, decodedValue.substring(0, 20) + '...');
      return decodedValue;
    } else {
      console.warn(`🍪 Cookie ${name} not found`);
    }
  } catch (e) {
    console.error("Error reading cookie:", e);
  }
  
  return undefined;
};

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - adds auth header automatically
apiClient.interceptors.request.use(
  async (config) => {
    console.log("🔍 Interceptor: Making request to:", config.url);
    
    // Get token from cookies (client-side only)
    let token = getClientCookie('access_token');
    
    // If no token, try to get it from cookies-next in client context
    if (!token && typeof window !== 'undefined') {
      try {
        const { getCookie } = await import('cookies-next');
        token = getCookie('access_token') as string | undefined;
      } catch (e) {
        // cookies-next might not work in some contexts
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Interceptor: Added Authorization header");
    } else {
      console.warn("⚠️ Interceptor: No access token found");
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Interceptor: Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Interceptor: Response success:", response.status);
    return response;
  },
  async (error) => {
    console.error("❌ Interceptor: Response error:", error.response?.status, error.response?.data);
    
    const original = error.config;
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !original._retry) {
      
      // Special handling for logout endpoint - don't retry
      if (original.url?.includes('/auth/logout')) {
        console.log("🚫 Logout endpoint failed with 401, not retrying");
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Interceptor: Attempting token refresh...");
        
        // Import refresh function dynamically to avoid circular imports
        const { refreshToken } = await import('../services/auth.api');
        await refreshToken();
        
        const newToken = getClientCookie('access_token');
        if (newToken) {
          console.log("✅ Interceptor: Token refreshed successfully");
          processQueue(null, newToken);
          
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        } else {
          throw new Error("No token received after refresh");
        }
      } catch (refreshError) {
        console.error("❌ Interceptor: Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        
        // Clear cookies manually
        if (typeof window !== 'undefined') {
          document.cookie = 'access_token=; Max-Age=0; path=/';
          document.cookie = 'refresh_token=; Max-Age=0; path=/';
          document.cookie = 'user_role=; Max-Age=0; path=/';
          document.cookie = 'user_id=; Max-Age=0; path=/';
        }
        
        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/authpage/login')) {
          console.log("🔄 Redirecting to login page");
          window.location.href = '/authpage/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
