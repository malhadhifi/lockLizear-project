import api from '../../../services/api';
const publicationService = {
  getAll: (params = {}) => api.get('/publications', { params }),
  getById: (id) => api.get(`/publications/${id}`),
  create: (data) => api.post('/publications', data),
  update: (id, data) => api.put(`/publications/${id}`, data),
  delete: (id) => api.delete(`/publications/${id}`),
  addDocument: (id, documentId) => api.post(`/publications/${id}/documents`, { documentId }),
  removeDocument: (id, documentId) => api.delete(`/publications/${id}/documents/${documentId}`),
  getSubscribers: (id) => api.get(`/publications/${id}/subscribers`),
  exportCSV: (params = {}) => api.get('/publications/export', { params }),
};
export default publicationService;
