import axios from 'axios';
import { getCookie, setCookie, eraseCookie } from '@/common/utils/cookieUtils';
import useUiStore from '@/stores/uiStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

let activeRequestsCount = 0;

const showLoader = () => {
  if (activeRequestsCount === 0) {
    useUiStore.getState().setGlobalLoading(true);
  }
  activeRequestsCount++;
};

const hideLoader = () => {
  activeRequestsCount--;
  if (activeRequestsCount < 0) activeRequestsCount = 0;
  if (activeRequestsCount === 0) {
    useUiStore.getState().setGlobalLoading(false);
  }
};

// Request interceptor - gắn JWT token
api.interceptors.request.use(
  (config) => {
    const skipLoading = config.skipLoading || config.url?.includes('/auth/refresh');
    if (!skipLoading) {
      showLoader();
    }

    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    const skipLoading = error.config?.skipLoading || error.config?.url?.includes('/auth/refresh');
    if (!skipLoading) {
      hideLoader();
    }
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi và refresh token
api.interceptors.response.use(
  (response) => {
    const skipLoading = response.config?.skipLoading || response.config?.url?.includes('/auth/refresh');
    if (!skipLoading) {
      hideLoader();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const skipLoading = originalRequest?.skipLoading || originalRequest?.url?.includes('/auth/refresh');
    if (!skipLoading) {
      hideLoader();
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`, { refreshToken });
          if (res.status === 200 && res.data?.success) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            setCookie('accessToken', accessToken, 1); // 1 day
            if (newRefreshToken) setCookie('refreshToken', newRefreshToken, 7); // 7 days
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('user');
        eraseCookie('accessToken');
        eraseCookie('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
