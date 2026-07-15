import api from '@/services/api';

const postService = {
  getFeatured: async () => {
    const response = await api.get('/posts/featured');
    return response.data;
  },
  getPaged: async (pageIndex = 1, pageSize = 10, keyword = '', category = 'ALL', status = 'ALL') => {
    const response = await api.post('/posts/page', {
      pageIndex,
      pageSize,
      keyword,
      category,
      status,
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/posts/id/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
};

export default postService;
