import { create } from 'zustand';
import galleryService from '@/modules/gallery/services/galleryService';
import useUiStore from '@/stores/uiStore';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const backendUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:8080';
  return `${backendUrl}${url}`;
};

export const useGalleryStore = create((set, get) => ({
  galleries: [],
  loading: true,
  selectedAlbum: null,
  albumMedia: [],
  mediaLoading: false,
  openAlbumForm: false,
  confirmDeleteMediaId: null,

  getImageUrl,

  resetStore: () => set({
    galleries: [],
    loading: true,
    selectedAlbum: null,
    albumMedia: [],
    mediaLoading: false,
    openAlbumForm: false,
    confirmDeleteMediaId: null,
  }),

  setOpenAlbumForm: (open) => set({ openAlbumForm: open }),
  setConfirmDeleteMediaId: (id) => set({ confirmDeleteMediaId: id }),

  fetchGalleries: async () => {
    set({ loading: true });
    try {
      const res = await galleryService.getAll();
      if (res.success) {
        set({ galleries: res.data || [] });
      }
    } catch (error) {
      useUiStore.getState().showNotification('Lỗi khi tải thư viện ảnh', 'error');
    } finally {
      set({ loading: false });
    }
  },

  loadAlbumMedia: async (albumId) => {
    set({ mediaLoading: true });
    try {
      const res = await galleryService.getMedia(albumId);
      if (res.success) {
        set({ albumMedia: res.data || [] });
      }
    } catch (error) {
      useUiStore.getState().showNotification('Lỗi khi tải danh sách hình ảnh trong album', 'error');
    } finally {
      set({ mediaLoading: false });
    }
  },

  handleOpenAlbum: (album) => {
    set({ selectedAlbum: album });
    get().loadAlbumMedia(album.id);
  },

  handleBackToAlbums: () => {
    set({ selectedAlbum: null, albumMedia: [] });
    get().fetchGalleries();
  },

  createAlbum: async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      visibility: values.visibility,
      sortOrder: 0,
    };
    try {
      const res = await galleryService.create(payload);
      if (res.success) {
        set({ openAlbumForm: false });
        await get().fetchGalleries();
        useUiStore.getState().showNotification('Tạo Album ảnh thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Tạo album thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi tạo Album', 'error');
      return { success: false };
    }
  },

  uploadMedia: async (files) => {
    const { selectedAlbum, loadAlbumMedia } = get();
    if (!files || files.length === 0 || !selectedAlbum) return;

    useUiStore.getState().showNotification(`Đang tải lên ${files.length} tệp tin ảnh...`, 'info');
    try {
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const res = await galleryService.uploadMedia(selectedAlbum.id, files[i]);
        if (res.success) {
          successCount++;
        }
      }
      useUiStore.getState().showNotification(`Đã tải lên thành công ${successCount}/${files.length} ảnh!`, 'success');
      await loadAlbumMedia(selectedAlbum.id);
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi trong quá trình tải ảnh lên', 'error');
    }
  },

  deleteMedia: async () => {
    const { confirmDeleteMediaId, selectedAlbum, loadAlbumMedia } = get();
    if (!confirmDeleteMediaId) return;
    try {
      const res = await galleryService.deleteMedia(confirmDeleteMediaId);
      if (res.success) {
        await loadAlbumMedia(selectedAlbum.id);
        set({ confirmDeleteMediaId: null });
        useUiStore.getState().showNotification('Đã xóa ảnh thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa ảnh thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa hình ảnh', 'error');
      return { success: false };
    } finally {
      set({ confirmDeleteMediaId: null });
    }
  },
}));
