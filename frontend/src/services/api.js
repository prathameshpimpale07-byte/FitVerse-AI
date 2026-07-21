import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fitverse-ai-2.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitverse_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 for expired tokens (skip for auth login/register endpoints)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register') || error.config?.url?.includes('/auth/google');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('fitverse_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
