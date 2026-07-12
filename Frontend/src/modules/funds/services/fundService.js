import api from '@/services/api';

const fundService = {
  getReport: async () => {
    const response = await api.get('/funds/report');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/funds');
    return response.data;
  },
  getTransactions: async (fundId) => {
    const response = await api.get(`/funds/${fundId}/transactions`);
    return response.data;
  },
  createFund: async (data) => {
    const response = await api.post('/funds', data);
    return response.data;
  },
  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },
  approveTransaction: async (id, status) => {
    const response = await api.put(`/transactions/${id}/approve`, null, { params: { status } });
    return response.data;
  },
  updateFund: async (id, data) => {
    const response = await api.put(`/funds/${id}`, data);
    return response.data;
  },
  deleteFund: async (id) => {
    const response = await api.delete(`/funds/${id}`);
    return response.data;
  }
};

export default fundService;
