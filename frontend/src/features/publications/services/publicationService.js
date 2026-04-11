import { api } from '../../../lib/axios';

const publicationService = {
  getAll: (params = {}) => api.get('/library/publications', { params }),
  getById: (id) => api.get(`/library/publications/${id}`),
  create: (data) => api.post('/library/publications', data),
  update: (id, data) => api.put(`/library/publications/${id}`, data),
  delete: (id) => api.delete(`/library/publications/${id}`),
  addDocument: (id, documentId) => api.post(`/library/publications/${id}/documents`, { documentId }),
  removeDocument: (id, documentId) => api.delete(`/library/publications/${id}/documents/${documentId}`),
  getSubscribers: (id) => api.get(`/library/publications/${id}/subscribers`),
  exportCSV: (params = {}) => api.get('/library/publications/export', { params }),
};

export default publicationService;
