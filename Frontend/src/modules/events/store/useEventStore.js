import { create } from 'zustand';
import eventService from '@/modules/events/services/eventService';
import { format } from 'date-fns';
import useUiStore from '@/stores/uiStore';
import { EventStatus } from '@/common/constants';

export const useEventStore = create((set, get) => ({
  searchObject: {
    keyword: '',
    status: 'ALL',
    annual: 'ALL',
  },
  totalElements: 0,
  totalPages: 0,
  eventsList: [],
  dataList: [],
  openConfirmDeletePopup: false,
  openCreateEditPopup: false,
  selectedRow: {
    title: '',
    description: '',
    eventDate: new Date(),
    location: '',
    annual: false,
    status: EventStatus.ACTIVE,
  },
  loading: false,

  resetStore: () => set({
    searchObject: { keyword: '', status: 'ALL', annual: 'ALL' },
    totalElements: 0,
    totalPages: 0,
    eventsList: [],
    dataList: [],
    openCreateEditPopup: false,
    selectedRow: {
      title: '',
      description: '',
      eventDate: new Date(),
      location: '',
      annual: false,
      status: EventStatus.ACTIVE,
    },
    openConfirmDeletePopup: false,
    loading: false,
  }),

  setSearchObject: (obj) => set((state) => ({ searchObject: { ...state.searchObject, ...obj } })),

  pagingEvent: async () => {
    set({ loading: true });
    try {
      const res = await eventService.getAll();
      if (res.success) {
        const content = res.data || [];
        set({ eventsList: content });
        get().applyFilters();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      set({ loading: false });
    }
  },

  applyFilters: () => {
    const { keyword, status, annual } = get().searchObject;
    let list = [...get().eventsList];

    if (keyword && keyword.trim() !== '') {
      const kw = keyword.toLowerCase().trim();
      list = list.filter(e => 
        (e.title && e.title.toLowerCase().includes(kw)) ||
        (e.description && e.description.toLowerCase().includes(kw)) ||
        (e.location && e.location.toLowerCase().includes(kw))
      );
    }

    if (status && status !== 'ALL') {
      list = list.filter(e => e.status === status);
    }

    if (annual && annual !== 'ALL') {
      const isAnnual = annual === 'YES';
      list = list.filter(e => e.annual === isAnnual);
    }

    set({
      dataList: list,
      totalElements: list.length,
      totalPages: 1,
    });
  },

  handleOpenCreateEdit: (row) => {
    if (row) {
      set({
        selectedRow: {
          id: row.id,
          title: row.title || '',
          description: row.description || '',
          eventDate: row.eventDate ? new Date(row.eventDate) : new Date(),
          location: row.location || '',
          annual: row.annual || false,
          status: row.status || EventStatus.ACTIVE,
        },
        openCreateEditPopup: true,
      });
    } else {
      set({
        selectedRow: {
          title: '',
          description: '',
          eventDate: new Date(),
          location: '',
          annual: false,
          status: EventStatus.ACTIVE,
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
    const { selectedRow, pagingEvent, handleClose } = get();
    if (!selectedRow?.id) return;
    try {
      const res = await eventService.delete(selectedRow.id);
      if (res.success) {
        await pagingEvent();
        handleClose();
        useUiStore.getState().showNotification('Xóa sự kiện thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa sự kiện', 'error');
      return { success: false, message: 'Lỗi hệ thống' };
    }
  },

  saveEvent: async (values) => {
    const { selectedRow, pagingEvent, handleClose } = get();
    const formattedEventDate = format(new Date(values.eventDate), "yyyy-MM-dd'T'HH:mm:ss");
    const payload = {
      title: values.title,
      description: values.description,
      eventDate: formattedEventDate,
      location: values.location,
      annual: values.annual,
      status: values.status,
    };
    try {
      let res;
      if (selectedRow?.id) {
        res = await eventService.update(selectedRow.id, payload);
      } else {
        res = await eventService.create(payload);
      }
      if (res.success) {
        await pagingEvent();
        handleClose();
        useUiStore.getState().showNotification(selectedRow?.id ? 'Cập nhật sự kiện thành công!' : 'Thêm sự kiện mới thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thao tác thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi lưu sự kiện', 'error');
      return { success: false, message: 'Lỗi hệ thống' };
    }
  },
}));
