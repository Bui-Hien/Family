# FRONTEND RULES — Phần 3: Table, Store, Service & Page Patterns

> Trigger: Khi viết table, store, service, hoặc page orchestrator.

---

## VII. TABLE PATTERN — CommonTable

```jsx
import CommonTable from '@/common/components/table/CommonTable';

const columns = [
  { accessorKey: 'fieldName', header: 'Tiêu đề cột' },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    Cell: ({ cell }) => {
      const val = cell.getValue();
      return val === TransactionStatus.APPROVED  // ★ Dùng Enum, KHÔNG hardcode
        ? <Chip label="Đã duyệt" color="success" size="small" />
        : <Chip label="Chờ duyệt" color="warning" size="small" />;
    },
  },
];

<CommonTable columns={columns} data={dataArray} />
```

**Quy tắc**: `accessorKey` cho field, `header` cho tiêu đề, `Cell: ({ cell, row }) => ...` cho custom render.

---

## VIII. ZUSTAND STORE PATTERN

```javascript
import { create } from 'zustand';
import myService from '@/modules/myModule/services/myService';
import useUiStore from '@/stores/uiStore';

export const useMyStore = create((set, get) => ({
  // STATE
  loading: false,
  dataList: [],
  filteredList: [],
  searchObject: { keyword: '', status: 'ALL' },
  selectedRow: null,
  openCreateEditPopup: false,
  deleteId: null,

  // RESET — BẮT BUỘC có
  resetStore: () => set({
    loading: false, dataList: [], filteredList: [],
    searchObject: { keyword: '', status: 'ALL' },
    selectedRow: null, openCreateEditPopup: false, deleteId: null,
  }),

  // SETTERS
  setSearchObject: (obj) => set((s) => ({ searchObject: { ...s.searchObject, ...obj } })),
  setSelectedRow: (row) => set({ selectedRow: row }),
  setOpenCreateEditPopup: (open) => set({ openCreateEditPopup: open }),
  setDeleteId: (id) => set({ deleteId: id }),

  // FETCH
  fetchData: async () => {
    set({ loading: true });
    try {
      const res = await myService.getAll();
      if (res.success) { set({ dataList: res.data || [] }); get().applyFilters(); }
    } catch (error) { console.error('Error:', error); }
    finally { set({ loading: false }); }
  },

  // FILTER — lưu riêng filteredList, KHÔNG sửa dataList gốc
  applyFilters: () => {
    const { keyword, status } = get().searchObject;
    let list = [...get().dataList];
    // ... filter logic
    set({ filteredList: list });
  },

  // SAVE
  saveData: async (values) => {
    const { selectedRow, fetchData } = get();
    try {
      const res = selectedRow?.id
        ? await myService.update(selectedRow.id, values)
        : await myService.create(values);
      if (res.success) {
        set({ openCreateEditPopup: false, selectedRow: null });
        await fetchData();
        useUiStore.getState().showNotification(
          selectedRow?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thất bại', 'error');
      return { success: false };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi hệ thống', 'error');
      return { success: false };
    }
  },

  // DELETE
  handleDelete: async () => {
    const { deleteId, fetchData } = get();
    if (!deleteId) return;
    try {
      const res = await myService.delete(deleteId);
      if (res.success) {
        set({ deleteId: null }); await fetchData();
        useUiStore.getState().showNotification('Xoá thành công!', 'success');
      } else { useUiStore.getState().showNotification(res.message || 'Xoá thất bại', 'error'); }
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xoá', 'error');
    }
  },

  handleClose: () => set({ openCreateEditPopup: false, selectedRow: null }),
}));
```

**Quy tắc Store**: Notification qua `useUiStore.getState().showNotification()`, resetStore BẮT BUỘC, filter lưu riêng `filteredList`.

---

## IX. SERVICE PATTERN — API CALLS

```javascript
import api from '@/services/api';

const myService = {
  getAll: async (params) => { const r = await api.get('/resource', { params }); return r.data; },
  getById: async (id) => { const r = await api.get(`/resource/${id}`); return r.data; },
  create: async (data) => { const r = await api.post('/resource', data); return r.data; },
  update: async (id, data) => { const r = await api.put(`/resource/${id}`, data); return r.data; },
  delete: async (id) => { const r = await api.delete(`/resource/${id}`); return r.data; },
  getLookup: async () => { const r = await api.get('/resource/lookup'); return r.data; },
};
export default myService;
```

**Quy tắc**: Luôn dùng `api` instance từ `@/services/api`, return `response.data`, KHÔNG xử lý UI trong service.

---

## X. PAGE COMPONENT PATTERN — TRANG CHÍNH

```jsx
const MyPage = () => {
  const { loading, dataList, fetchData, resetStore, openCreateEditPopup, deleteId, setDeleteId, handleDelete } = useMyStore();

  useEffect(() => { fetchData(); return () => resetStore(); }, []);

  if (loading && dataList.length === 0) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      <MyToolbar />
      <MyFilter />
      <MyList />
      {openCreateEditPopup && <MyForm />}   {/* Lazy render */}
      <CommonConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} title="Xác nhận xoá"
        text="Thao tác không thể hoàn tác." />
    </Box>
  );
};
```

**Quy tắc Page**: Lazy render Form, cleanup resetStore, CommonLoading skeleton, CommonConfirmDialog cho confirm.
