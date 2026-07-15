import api from '@/services/api';

const userService = {
  getPaged: async (pageIndex = 1, pageSize = 10, keyword = '', role = 'ALL') => {
    const response = await api.post('/users/page', {
      pageIndex,
      pageSize,
      keyword,
      role,
    });
    return response.data;
  },
  changeRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, null, { params: { role } });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
