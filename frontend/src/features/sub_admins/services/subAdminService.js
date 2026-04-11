import api from '../../../services/api';
const subAdminService = {
  getAll: (params = {}) => api.get('/sub-admins', { params }),
  create: (data) => api.post('/sub-admins', data),
  update: (id, data) => api.put(`/sub-admins/${id}`, data),
  delete: (id) => api.delete(`/sub-admins/${id}`),
  assignPermissions: (adminId, permissions) => api.post(`/sub-admins/${adminId}/permissions`, { permissions }),
};
export default subAdminService;
