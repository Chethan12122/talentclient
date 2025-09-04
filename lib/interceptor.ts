// Simple Axios interceptor setup for demonstration
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add token or other headers here
    return config;
  },
  (error: any) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;
