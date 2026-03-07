import api from '../../../services/api';
const documentService = {
  getAll: (params = {}) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  suspend: (id) => api.put(`/documents/${id}/suspend`),
  activate: (id) => api.put(`/documents/${id}/activate`),
  exportCSV: (params = {}) => api.get('/documents/export', { params }),
  getDocumentAccessList: (id) => api.get(`/documents/${id}/access`),
};
export default documentService;
