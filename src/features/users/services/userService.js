import api from '../../../services/api';

const userService = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  suspend: (id) => api.put(`/users/${id}/suspend`),
  activate: (id) => api.put(`/users/${id}/activate`),
  bulkAction: (data) => api.post('/users/bulk-actions', data),
  importCSV: (data) => api.post('/users/import', data),
  exportCSV: (params = {}) => api.get('/users/export', { params }),
  resendLicense: (id) => api.post(`/users/${id}/resend-license`),
  resendLicenseBulk: (data) => api.post('/users/resend-license-bulk', data),
  getUserDevices: (id) => api.get(`/users/${id}/devices`),
  revokeDevice: (deviceId) => api.delete(`/users/devices/${deviceId}`),
};

export default userService;
