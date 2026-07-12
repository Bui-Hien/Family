import api from '@/services/api';

const treeService = {
  getFullTree: async () => {
    const response = await api.get('/tree');
    return response.data;
  },
  getSubTree: async (profileId) => {
    const response = await api.get(`/tree/${profileId}`);
    return response.data;
  },
  getAncestors: async (profileId) => {
    const response = await api.get(`/tree/ancestors/${profileId}`);
    return response.data;
  },
  updateRelationship: async (relationshipData) => {
    const response = await api.put('/tree/relationship', relationshipData);
    return response.data;
  },
  exportTree: async () => {
    const response = await api.get('/tree/export', { responseType: 'blob' });
    return response.data;
  }
};

export default treeService;
