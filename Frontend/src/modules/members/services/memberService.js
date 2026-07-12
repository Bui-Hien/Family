import api from '@/services/api';

const memberService = {
  getPaged: async (pageIndex = 1, pageSize = 10, keyword = '', sortField = '', sortDirection = 'DESC') => {
    const response = await api.post('/profiles/page', {
      pageIndex,
      pageSize,
      keyword,
      sortField,
      sortDirection,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/profiles');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/profiles', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/profiles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/profiles/${id}`);
    return response.data;
  },

  search: async (keyword) => {
    const response = await api.get(`/profiles/search`, { params: { keyword } });
    return response.data;
  },
};

export default memberService;
