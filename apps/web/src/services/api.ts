import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
const forceLogoutUser = async () => {
  // Wipe out the access token from React's memory (Context/Redux/Zustand)
  // clearAuthStore();
  localStorage.removeItem('userPreferences');
  localStorage.removeItem('accessToken');
}

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
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
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
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
