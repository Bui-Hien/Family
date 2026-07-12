import api from '@/services/api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // data contains com.family.common.dto.ApiResponse containing LoginResponse
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;
