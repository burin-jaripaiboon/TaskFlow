import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const forceLogoutUser = async () => {
  localStorage.removeItem('userPreferences');
  useAuthStore.getState().clearAuth();
}

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.errorCode;
    if (errorCode === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const renewAccessResponse = await axios.post(`${BASE_URL}/auth/renew`, {}, { withCredentials: true });
        const newAccessToken = renewAccessResponse.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        forceLogoutUser();
        window.location.href = '/login?reason=unauthorized';
        return Promise.reject(refreshError);
      }
    }
    if (errorCode === 'DEVICE_TOKEN_EXPIRED') {
      forceLogoutUser();
      window.location.href = '/login?reason=expired'; 
    }
    return Promise.reject(error);
  }
);

export default api;
