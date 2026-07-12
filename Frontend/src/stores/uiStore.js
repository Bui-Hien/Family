import { create } from 'zustand';

const useUiStore = create((set) => ({
  // Theme Mode: light or dark
  themeMode: localStorage.getItem('themeMode') || 'light',
  toggleThemeMode: () => set((state) => {
    const newMode = state.themeMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    return { themeMode: newMode };
  }),

  // Sidebar state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Loading state
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  // Notifications (Snackbar/Toast)
  notification: {
    open: false,
    message: '',
    severity: 'info', // 'success' | 'info' | 'warning' | 'error'
  },
  showNotification: (message, severity = 'info') => set({
    notification: { open: true, message, severity }
  }),
  hideNotification: () => set((state) => ({
    notification: { ...state.notification, open: false }
  })),
}));

export default useUiStore;
