import { create } from 'zustand';
import { getCookie, setCookie, eraseCookie } from '@/common/utils/cookieUtils';

const savedUser = localStorage.getItem('user');
const token = getCookie('accessToken');

const useAuthStore = create((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  profile: null,
  accessToken: token || null,
  refreshToken: getCookie('refreshToken') || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCookie('accessToken', accessToken, 1); // Access token expires in 1 day
    if (refreshToken) {
      setCookie('refreshToken', refreshToken, 7); // Refresh token expires in 7 days
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('user');
    eraseCookie('accessToken');
    eraseCookie('refreshToken');
    set({ user: null, profile: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;
