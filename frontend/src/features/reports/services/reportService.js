import api from '../../../services/api';
const reportService = {
  getViewLogs: (filters = {}) => api.get('/reports/views', { params: filters }),
  getPrintLogs: (filters = {}) => api.get('/reports/prints', { params: filters }),
  getAdminLogs: (filters = {}) => api.get('/reports/admin', { params: filters }),
  getTopDocuments: () => api.get('/reports/top-documents'),
  getSystemStats: () => api.get('/reports/system-stats'),
  exportLogsCSV: (filters = {}) => api.get('/reports/export', { params: filters }),
};
export default reportService;
