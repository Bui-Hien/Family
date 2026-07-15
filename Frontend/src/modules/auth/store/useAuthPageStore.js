import { create } from 'zustand';
import authService from '@/modules/auth/services/authService';
import useAuthStore from '@/stores/authStore';
import useUiStore from '@/stores/uiStore';

export const useAuthPageStore = create(() => ({
  login: async (values) => {
    try {
      const response = await authService.login(values.username, values.password);
      if (response.success && response.data) {
        const { accessToken, refreshToken, userId, username, fullName, role } = response.data;
        const user = { id: userId, username, fullName, role };
        useAuthStore.getState().setAuth(user, accessToken, refreshToken);
        useUiStore.getState().showNotification('Đăng nhập thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(response.message || 'Đăng nhập thất bại', 'error');
      return { success: false };
    } catch (error) {
      useUiStore.getState().showNotification(
        error.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ',
        'error'
      );
      return { success: false };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        useUiStore.getState().showNotification(
          response.message || 'Yêu cầu khôi phục mật khẩu thành công. Hãy kiểm tra email!',
          'success'
        );
        return { success: true };
      }
      useUiStore.getState().showNotification(response.message || 'Yêu cầu thất bại', 'error');
      return { success: false };
    } catch (error) {
      useUiStore.getState().showNotification(
        error.response?.data?.message || 'Có lỗi xảy ra',
        'error'
      );
      return { success: false };
    }
  },
}));
