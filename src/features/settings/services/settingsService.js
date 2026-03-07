import api from '../../../services/api';
const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (section, data) => api.put(`/settings/${section}`, data),
  testSMTP: (data) => api.post('/settings/test-smtp', data),
  backupNow: () => api.post('/settings/backup'),
  restoreBackup: (data) => api.post('/settings/restore', data),
};
export default settingsService;
