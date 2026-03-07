import api from '../../../services/api';

const documentService = {
  getAll: async (params = {}) => {
    return await api.get('/documents', { params });
  },

  getById: async (id) => {
    return await api.get(`/documents/${id}`);
  },

  create: async (data) => {
    return await api.post('/documents', data);
  },

  update: async (id, data) => {
    return await api.put(`/documents/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/documents/${id}`);
  },

  suspend: async (id) => {
    return await api.post(`/documents/${id}/suspend`);
  },

  activate: async (id) => {
    return await api.post(`/documents/${id}/activate`);
  },

  getDocumentAccessList: async (id) => {
    return await api.get(`/documents/${id}/access`);
  }
};

export default documentService;
