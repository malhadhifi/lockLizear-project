import api from '../../../services/api';

const publicationService = {
  getAll: async (params = {}) => {
    return await api.get('/publications', { params });
  },

  getById: async (id) => {
    return await api.get(`/publications/${id}`);
  },

  create: async (data) => {
    return await api.post('/publications', data);
  },

  update: async (id, data) => {
    return await api.put(`/publications/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/publications/${id}`);
  },

  addDocument: async (id, documentId) => {
    return await api.post(`/publications/${id}/documents`, { document_id: documentId });
  },

  removeDocument: async (id, documentId) => {
    return await api.delete(`/publications/${id}/documents/${documentId}`);
  },

  getSubscribers: async (id) => {
    return await api.get(`/publications/${id}/subscribers`);
  }
};

export default publicationService;
