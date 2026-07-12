import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
});

// Request interceptor - gắn JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi và refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`, { refreshToken });
          if (res.status === 200 && res.data?.success) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
