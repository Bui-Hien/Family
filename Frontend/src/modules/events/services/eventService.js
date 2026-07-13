import api from '@/services/api';

const eventService = {
  getUpcoming: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  getPaged: async (pageIndex = 1, pageSize = 10, keyword = '', status = 'ALL', annual = 'ALL') => {
    const response = await api.post('/events/page', {
      pageIndex,
      pageSize,
      keyword,
      status,
      annual,
    });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/events', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export default eventService;
