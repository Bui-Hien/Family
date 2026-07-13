import { create } from 'zustand';
import memberService from '@/modules/members/services/memberService';
import { format } from 'date-fns';
import useUiStore from '@/stores/uiStore';
import { Gender } from '@/common/constants';

export const useMemberStore = create((set, get) => ({
  searchObject: {
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
    gender: 'ALL',
    generation: 'ALL',
    status: 'ALL',
  },
  totalElements: 0,
  dataList: [],
  membersList: [],
  loading: false,
  openCreateEditPopup: false,
  openConfirmDeletePopup: false,
  selectedRow: {
    fullName: '',
    gender: Gender.MALE,
    generation: 1,
    birthDate: '',
    deathDate: '',
    occupation: '',
    biography: '',
    achievements: '',
    fatherId: '',
    motherId: '',
    spouseId: '',
    avatarUrl: '',
    additionalInfo: '',
  },

  resetStore: () => set({
    searchObject: { pageIndex: 1, pageSize: 10, keyword: '', gender: 'ALL', generation: 'ALL', status: 'ALL' },
    totalElements: 0,
    dataList: [],
    membersList: [],
    loading: false,
    openCreateEditPopup: false,
    openConfirmDeletePopup: false,
    selectedRow: {
      fullName: '',
      gender: Gender.MALE,
      generation: 1,
      birthDate: '',
      deathDate: '',
      occupation: '',
      biography: '',
      achievements: '',
      fatherId: '',
      motherId: '',
      spouseId: '',
      avatarUrl: '',
      additionalInfo: '',
    },
  }),

  setSearchObject: (obj) => set((state) => ({ searchObject: { ...state.searchObject, ...obj } })),

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const res = await memberService.getLookup();
      if (res.success) {
        set({ membersList: res.data || [] });
      }
      await get().pagingMember(true);
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  pagingMember: async (skipLoading = false) => {
    if (!skipLoading) set({ loading: true });
    const { pageIndex, pageSize, keyword, gender, generation, status } = get().searchObject;
    try {
      const res = await memberService.getPaged(pageIndex, pageSize, keyword, gender, generation, status);
      if (res.success && res.data) {
        set({
          dataList: res.data.content || [],
          totalElements: res.data.totalElements || 0
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!skipLoading) set({ loading: false });
    }
  },

  fetchMembersList: async (currentId) => {
    try {
      const res = await memberService.getLookup(currentId);
      if (res.success) {
        set({ membersList: res.data || [] });
      }
    } catch (error) {
      console.error(error);
    }
  },

  handleOpenCreateEdit: (row, defaultValues = null) => {
    if (row) {
      set({
        selectedRow: {
          id: row.id,
          fullName: row.fullName || '',
          gender: row.gender || Gender.MALE,
          generation: row.generation || 1,
          birthDate: row.birthDate || '',
          deathDate: row.deathDate || '',
          occupation: row.occupation || '',
          biography: row.biography || '',
          achievements: row.achievements || '',
          fatherId: row.fatherId || '',
          motherId: row.motherId || '',
          spouseId: row.spouseId || (row.spouse ? row.spouse.id : ''),
          avatarUrl: row.avatarUrl || '',
          additionalInfo: row.additionalInfo ? JSON.stringify(row.additionalInfo, null, 2) : '',
        },
        openCreateEditPopup: true,
      });
    } else {
      set({
        selectedRow: {
          fullName: '',
          gender: Gender.MALE,
          generation: 1,
          birthDate: '',
          deathDate: '',
          occupation: '',
          biography: '',
          achievements: '',
          fatherId: '',
          motherId: '',
          spouseId: '',
          avatarUrl: '',
          additionalInfo: '',
          ...defaultValues
        },
        openCreateEditPopup: true,
      });
    }
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
    });
  },

  handleConfirmDelete: async () => {
    const { selectedRow, pagingMember, fetchMembersList, handleClose } = get();
    if (!selectedRow?.id) return;
    try {
      const res = await memberService.delete(selectedRow.id);
      if (res.success) {
        await pagingMember();
        await fetchMembersList();
        
        // Cập nhật lại cây gia phả nếu đang mở màn hình cây gia phả
        const { useTreeStore } = await import('@/modules/family-tree/store/useTreeStore');
        useTreeStore.getState().fetchTree().catch(() => {});

        handleClose();
        useUiStore.getState().showNotification('Xóa thành viên thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa thành viên', 'error');
      return { success: false };
    }
  },

  saveMember: async (values) => {
    const { selectedRow, pagingMember, fetchMembersList, handleClose } = get();
    const payload = {
      fullName: values.fullName,
      gender: values.gender,
      generation: parseInt(values.generation),
      birthDate: values.birthDate ? format(new Date(values.birthDate), 'yyyy-MM-dd') : null,
      deathDate: values.deathDate ? format(new Date(values.deathDate), 'yyyy-MM-dd') : null,
      occupation: values.occupation,
      biography: values.biography,
      achievements: values.achievements,
      fatherId: values.fatherId || null,
      motherId: values.motherId || null,
      spouseId: values.spouseId || null,
      avatarUrl: values.avatarUrl || null,
      additionalInfo: values.additionalInfo ? JSON.parse(values.additionalInfo) : null,
    };
    try {
      let res;
      if (selectedRow?.id) {
        res = await memberService.update(selectedRow.id, payload);
      } else {
        res = await memberService.create(payload);
      }
      if (res.success) {
        await pagingMember();
        await fetchMembersList();

        // Cập nhật lại cây gia phả nếu đang mở màn hình cây gia phả
        const { useTreeStore } = await import('@/modules/family-tree/store/useTreeStore');
        useTreeStore.getState().fetchTree().catch(() => {});

        handleClose();
        useUiStore.getState().showNotification(selectedRow?.id ? 'Cập nhật thành công!' : 'Thêm thành viên thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thao tác thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi lưu thông tin', 'error');
      return { success: false };
    }
  },
}));
