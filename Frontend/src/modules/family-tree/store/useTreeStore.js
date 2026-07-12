import { create } from 'zustand';
import treeService from '@/modules/family-tree/services/treeService';
import useUiStore from '@/stores/uiStore';

export const useTreeStore = create((set, get) => ({
  treeData: null,
  loading: true,

  resetStore: () => set({
    treeData: null,
    loading: true,
  }),

  fetchTree: async () => {
    set({ loading: true });
    try {
      const response = await treeService.getFullTree();
      if (response.success && response.data) {
        set({ treeData: response.data });
      }
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Không thể tải dữ liệu sơ đồ gia phả', 'error');
    } finally {
      set({ loading: false });
    }
  },

  exportTree: async () => {
    try {
      const blob = await treeService.exportTree();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gia-pha-dong-ho-${new Date().getFullYear()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xuất tệp dữ liệu gia phả', 'error');
    }
  },
}));
