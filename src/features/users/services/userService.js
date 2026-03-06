import api from '@/services/api';

const userService = {
  async getAll(params)        { const { data } = await api.get('/users', { params });    return data; },
  async getById(id)           { const { data } = await api.get(`/users/${id}`);          return data; },
  async create(payload)       { const { data } = await api.post('/users', payload);       return data; },
  async update(id, payload)   { const { data } = await api.put(`/users/${id}`, payload); return data; },
  async delete(id)            { await api.delete(`/users/${id}`);                        return true; },
  async suspend(id)           { const { data } = await api.post(`/users/${id}/suspend`); return data; },
  async activate(id)          { const { data } = await api.post(`/users/${id}/activate`);return data; },
  async bulkAction(action, ids) { const { data } = await api.post('/users/bulk', { action, ids }); return data; },
  async importCSV(file) {
    const form = new FormData(); form.append('file', file);
    const { data } = await api.post('/users/import', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data;
  },
  async exportCSV(params)        { const { data } = await api.get('/users/export', { params, responseType: 'blob' }); return data; },
  async resendLicense(id)        { const { data } = await api.post(`/users/${id}/resend-license`); return data; },
  async resendLicenseBulk(ids)   { const { data } = await api.post('/users/resend-license-bulk', { ids }); return data; },
  async getUserDevices(id)       { const { data } = await api.get(`/users/${id}/devices`); return data; },
  async revokeDevice(deviceId)   { const { data } = await api.delete(`/devices/${deviceId}`); return data; },
};

export default userService;
