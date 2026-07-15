import { create } from 'zustand';
import userService from '@/modules/admin/services/userService';
import memberService from '@/modules/members/services/memberService';
import useUiStore from '@/stores/uiStore';
import { UserRole } from '@/common/constants';

export const useAdminStore = create((set, get) => ({
  searchObject: {
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
    role: 'ALL',
  },
  totalElements: 0,
  usersList: [],
  dataList: [],
  loading: false,
  members: [],

  // Popup state
  openCreateEditPopup: false,
  openConfirmDeletePopup: false,
  selectedRow: null,
  deleteId: null,

  resetStore: () => set({
    searchObject: { pageIndex: 1, pageSize: 10, keyword: '', role: 'ALL' },
    totalElements: 0,
    usersList: [],
    dataList: [],
    loading: false,
    members: [],
    openCreateEditPopup: false,
    openConfirmDeletePopup: false,
    selectedRow: null,
    deleteId: null,
  }),

  setSearchObject: (obj) => set((state) => ({ searchObject: { ...state.searchObject, ...obj } })),

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [, membersRes] = await Promise.all([
        get().fetchUsersInternal(true),
        memberService.getLookup().catch(() => ({ success: false, data: [] })),
      ]);
      if (membersRes.success) {
        set({ members: membersRes.data || [] });
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUsersInternal: async (skipLoading = false) => {
    if (!skipLoading) set({ loading: true });
    const { pageIndex, pageSize, keyword, role } = get().searchObject;
    try {
      const res = await userService.getPaged(pageIndex, pageSize, keyword, role);
      if (res.success && res.data) {
        set({
          dataList: res.data.content || [],
          totalElements: res.data.totalElements || 0
        });
      }
      return res;
    } catch (error) {
      useUiStore.getState().showNotification('Lỗi khi tải danh sách người dùng', 'error');
      return { success: false };
    } finally {
      if (!skipLoading) set({ loading: false });
    }
  },

  pagingUser: async () => {
    await get().fetchUsersInternal();
  },

  handleSearch: (val) => {
    set((state) => ({
      searchObject: { ...state.searchObject, keyword: val, pageIndex: 1 },
    }));
    get().fetchUsersInternal();
  },

  handleOpenCreateEdit: (user) => {
    if (user) {
      set({
        selectedRow: {
          id: user.id,
          username: user.username || '',
          email: user.email || '',
          fullName: user.fullName || '',
          phoneNumber: user.phoneNumber || '',
          password: '',
          role: user.role || UserRole.FAMILY_MEMBER,
          profileId: user.profileId || '',
        },
        openCreateEditPopup: true,
      });
    } else {
      set({
        selectedRow: {
          username: '',
          email: '',
          fullName: '',
          phoneNumber: '',
          password: '',
          role: UserRole.FAMILY_MEMBER,
          profileId: '',
        },
        openCreateEditPopup: true,
      });
    }
  },

  handleDelete: (row) => {
    set({
      deleteId: row?.id || null,
      openConfirmDeletePopup: true,
    });
  },

  handleClose: () => {
    set({
      openCreateEditPopup: false,
      openConfirmDeletePopup: false,
      deleteId: null,
    });
  },

  handleConfirmDelete: async () => {
    const { deleteId, pagingUser, handleClose } = get();
    if (!deleteId) return;
    try {
      const res = await userService.delete(deleteId);
      if (res.success) {
        await pagingUser();
        handleClose();
        useUiStore.getState().showNotification('Xóa tài khoản người dùng thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa người dùng', 'error');
      return { success: false };
    }
  },

  saveUser: async (values) => {
    const { selectedRow, pagingUser, handleClose } = get();
    const payload = {
      username: values.username,
      email: values.email,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      role: values.role,
      profileId: values.profileId || null,
    };
    if (values.password) {
      payload.password = values.password;
    }
    try {
      let res;
      if (selectedRow?.id) {
        res = await userService.update(selectedRow.id, payload);
      } else {
        res = await userService.create(payload);
      }
      if (res.success) {
        await pagingUser();
        handleClose();
        useUiStore.getState().showNotification(
          selectedRow?.id ? 'Cập nhật tài khoản thành công!' : 'Tạo tài khoản thành công!',
          'success'
        );
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thao tác thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi lưu tài khoản', 'error');
      return { success: false };
    }
  },

  changeRole: async (userId, newRole) => {
    try {
      const res = await userService.changeRole(userId, newRole);
      if (res.success) {
        await get().pagingUser();
        useUiStore.getState().showNotification('Cập nhật quyền hạn thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Cập nhật thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi cập nhật quyền hạn', 'error');
      return { success: false };
    }
  },
}));
