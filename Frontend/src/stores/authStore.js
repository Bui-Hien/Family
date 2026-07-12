import { create } from 'zustand';

const mockUser = {
  id: 1,
  username: "admin",
  fullName: "Admin Dòng Họ (Test)",
  email: "admin@family.com",
  role: "ROLE_SYSTEM_ADMIN"
};

// Tạm thời tự động lưu token giả lập để bypass login màn hình
if (!localStorage.getItem('accessToken') || JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN') {
  localStorage.setItem('accessToken', 'mock-access-token');
  localStorage.setItem('refreshToken', 'mock-refresh-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
}

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || mockUser,
  accessToken: localStorage.getItem('accessToken') || 'mock-access-token',
  refreshToken: localStorage.getItem('refreshToken') || 'mock-refresh-token',
  isAuthenticated: true,
  loading: false,
  error: null,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;
