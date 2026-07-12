import api from '@/services/api';

const galleryService = {
  getAll: async () => {
    const response = await api.get('/galleries');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/galleries/${id}`);
    return response.data;
  },
  getMedia: async (id) => {
    const response = await api.get(`/galleries/${id}/media`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/galleries', data);
    return response.data;
  },
  uploadMedia: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/galleries/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteMedia: async (mediaId) => {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  }
};

export default galleryService;
