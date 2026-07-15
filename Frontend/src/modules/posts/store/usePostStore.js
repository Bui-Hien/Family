import { create } from 'zustand';
import postService from '@/modules/posts/services/postService';
import useUiStore from '@/stores/uiStore';
import { PostCategory, PostStatus } from '@/common/constants';

export const usePostStore = create((set, get) => ({
  searchObject: {
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
    category: 'ALL',
    status: 'ALL',
  },
  totalElements: 0,
  totalPages: 0,
  postsList: [],
  dataList: [],
  openConfirmDeletePopup: false,
  openCreateEditPopup: false,
  openViewPopup: false,
  selectedRow: {
    title: '',
    summary: '',
    content: '',
    category: PostCategory.TIN_TUC,
    status: PostStatus.PUBLISHED,
    featured: false,
  },
  loading: false,

  resetStore: () => set({
    searchObject: { pageIndex: 1, pageSize: 10, keyword: '', category: 'ALL', status: 'ALL' },
    totalElements: 0,
    totalPages: 0,
    postsList: [],
    dataList: [],
    openCreateEditPopup: false,
    selectedRow: {
      title: '',
      summary: '',
      content: '',
      category: 'TIN_TUC',
      status: 'PUBLISHED',
      featured: false,
    },
    openConfirmDeletePopup: false,
    openViewPopup: false,
    loading: false,
  }),

  setSearchObject: (obj) => set((state) => ({ searchObject: { ...state.searchObject, ...obj } })),

  pagingPost: async () => {
    set({ loading: true });
    const { pageIndex, pageSize, keyword, category, status } = get().searchObject;
    try {
      const res = await postService.getPaged(pageIndex, pageSize, keyword, category, status);
      if (res.success && res.data) {
        set({
          dataList: res.data.content || [],
          totalElements: res.data.totalElements || 0,
          totalPages: res.data.totalPages || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      set({ loading: false });
    }
  },

  handleOpenCreateEdit: (row) => {
    if (row) {
      set({
        selectedRow: {
          id: row.id,
          title: row.title || '',
          summary: row.summary || '',
          content: row.content || '',
          category: row.category || PostCategory.TIN_TUC,
          status: row.status || PostStatus.PUBLISHED,
          featured: row.featured || false,
        },
        openCreateEditPopup: true,
      });
    } else {
      set({
        selectedRow: {
          title: '',
          summary: '',
          content: '',
          category: 'TIN_TUC',
          status: 'PUBLISHED',
          featured: false,
        },
        openCreateEditPopup: true,
      });
    }
  },

  handleOpenView: (row) => {
    set({
      selectedRow: row,
      openViewPopup: true,
    });
  },

  handleDelete: (row) => {
    set({
      selectedRow: row,
      openConfirmDeletePopup: true,
    });
  },

  handleClose: () => {
    set({
      openConfirmDeletePopup: false,
      openCreateEditPopup: false,
      openViewPopup: false,
    });
  },

  handleConfirmDelete: async () => {
    const { selectedRow, pagingPost, handleClose } = get();
    if (!selectedRow?.id) return;
    try {
      const res = await postService.delete(selectedRow.id);
      if (res.success) {
        await pagingPost();
        handleClose();
        useUiStore.getState().showNotification('Xóa bài viết thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa bài viết thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa bài viết', 'error');
      return { success: false, message: 'Lỗi hệ thống' };
    }
  },

  savePost: async (values) => {
    const { selectedRow, pagingPost, handleClose } = get();
    const payload = {
      title: values.title,
      summary: values.summary,
      content: values.content,
      category: values.category,
      status: values.status,
      featured: values.featured,
      featuredImage: '',
    };
    try {
      let res;
      if (selectedRow?.id) {
        res = await postService.update(selectedRow.id, payload);
      } else {
        res = await postService.create(payload);
      }
      if (res.success) {
        await pagingPost();
        handleClose();
        useUiStore.getState().showNotification(selectedRow?.id ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết mới thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thao tác thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi lưu bài viết', 'error');
      return { success: false, message: 'Lỗi hệ thống' };
    }
  },
}));
