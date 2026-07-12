import { create } from 'zustand';
import fundService from '@/modules/funds/services/fundService';
import memberService from '@/modules/members/services/memberService';
import useUiStore from '@/stores/uiStore';
import { TransactionStatus } from '@/common/constants';

export const useFundStore = create((set, get) => ({
  report: null,
  funds: [],
  selectedFundId: '',
  transactions: [],
  members: [],
  loading: false,
  txLoading: false,

  openTxForm: false,
  openFundForm: false,
  editingFund: null,
  confirmApprove: { id: null, status: null },
  deleteFundId: null,

  resetStore: () => set({
    report: null,
    funds: [],
    selectedFundId: '',
    transactions: [],
    members: [],
    loading: false,
    txLoading: false,
    openTxForm: false,
    openFundForm: false,
    editingFund: null,
    confirmApprove: { id: null, status: null },
    deleteFundId: null,
  }),

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [reportRes, fundsRes, membersRes] = await Promise.all([
        fundService.getReport().catch(() => ({ success: false, data: null })),
        fundService.getAll().catch(() => ({ success: false, data: [] })),
        memberService.getAll().catch(() => ({ success: false, data: [] })),
      ]);

      let selectedId = get().selectedFundId;
      if (fundsRes.success && fundsRes.data) {
        set({ funds: fundsRes.data });
        if (fundsRes.data.length > 0) {
          const exists = fundsRes.data.some((f) => f.id === selectedId);
          if (!exists) {
            selectedId = fundsRes.data[0].id;
            set({ selectedFundId: selectedId });
          }
        } else {
          selectedId = '';
          set({ selectedFundId: '' });
        }
      }
      if (reportRes.success && reportRes.data) {
        set({ report: reportRes.data });
      }
      if (membersRes.success && membersRes.data) {
        set({ members: membersRes.data });
      }

      if (selectedId) {
        await get().fetchTransactions(selectedId);
      }
    } catch (error) {
      console.error('Error fetching initial funds data:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTransactions: async (fundId) => {
    if (!fundId) {
      set({ transactions: [] });
      return;
    }
    set({ txLoading: true });
    try {
      const res = await fundService.getTransactions(fundId);
      if (res.success) {
        set({ transactions: res.data || [] });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ txLoading: false });
    }
  },

  setSelectedFundId: async (id) => {
    set({ selectedFundId: id });
    await get().fetchTransactions(id);
  },

  handleApproveTx: async () => {
    const { confirmApprove, selectedFundId, fetchTransactions } = get();
    const { id, status } = confirmApprove;
    if (!id || !status) return { success: false };
    try {
      const res = await fundService.approveTransaction(id, status);
      if (res.success) {
        await fetchTransactions(selectedFundId);
        // Refresh Report & Fund Balances
        const [reportRes, fundsRes] = await Promise.all([
          fundService.getReport().catch(() => null),
          fundService.getAll().catch(() => null),
        ]);
        if (reportRes && reportRes.success) set({ report: reportRes.data });
        if (fundsRes && fundsRes.success) set({ funds: fundsRes.data });
        set({ confirmApprove: { id: null, status: null } });
        useUiStore.getState().showNotification(status === TransactionStatus.APPROVED ? 'Đã duyệt giao dịch thành công!' : 'Đã từ chối giao dịch', 'success');
        return { success: true, status };
      }
      useUiStore.getState().showNotification(res.message || 'Xử lý thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi phê duyệt giao dịch', 'error');
      return { success: false, message: 'Lỗi phê duyệt giao dịch' };
    }
  },

  handleDeleteFund: async () => {
    const { deleteFundId, fetchInitialData } = get();
    if (!deleteFundId) return { success: false };
    try {
      const res = await fundService.deleteFund(deleteFundId);
      if (res.success) {
        set({ deleteFundId: null });
        await fetchInitialData();
        useUiStore.getState().showNotification('Đã xóa quỹ thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Xóa quỹ thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi xóa quỹ dòng họ', 'error');
      return { success: false, message: 'Lỗi hệ thống' };
    }
  },

  saveFund: async (values) => {
    const { editingFund, fetchInitialData } = get();
    const payload = {
      name: values.name,
      description: values.description,
      initialBalance: parseFloat(values.initialBalance),
    };
    try {
      let res;
      if (editingFund) {
        res = await fundService.updateFund(editingFund.id, payload);
      } else {
        res = await fundService.createFund(payload);
      }
      if (res.success) {
        set({ openFundForm: false, editingFund: null });
        await fetchInitialData();
        useUiStore.getState().showNotification(editingFund ? 'Cập nhật quỹ thành công!' : 'Tạo quỹ mới thành công!', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Thao tác thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi lưu thông tin quỹ', 'error');
      return { success: false, message: 'Lỗi khi lưu thông tin quỹ' };
    }
  },

  saveTransaction: async (values) => {
    const { selectedFundId, fetchTransactions } = get();
    const payload = {
      fundId: values.fundId,
      profileId: values.profileId || null,
      amount: parseFloat(values.amount),
      type: values.type,
      note: values.note,
      transactionDate: new Date().toISOString(),
      status: TransactionStatus.PENDING,
    };
    try {
      const res = await fundService.createTransaction(payload);
      if (res.success) {
        set({ openTxForm: false });
        await fetchTransactions(selectedFundId);
        useUiStore.getState().showNotification('Gửi yêu cầu giao dịch thành công! Đang chờ phê duyệt.', 'success');
        return { success: true };
      }
      useUiStore.getState().showNotification(res.message || 'Giao dịch thất bại', 'error');
      return { success: false, message: res.message };
    } catch (error) {
      console.error(error);
      useUiStore.getState().showNotification('Lỗi khi gửi giao dịch', 'error');
      return { success: false, message: 'Lỗi khi gửi giao dịch' };
    }
  },

  setOpenTxForm: (open) => set({ openTxForm: open }),
  setOpenFundForm: (open) => set({ openFundForm: open }),
  setEditingFund: (fund) => set({ editingFund: fund }),
  setConfirmApprove: (data) => set({ confirmApprove: data }),
  setDeleteFundId: (id) => set({ deleteFundId: id }),
}));
