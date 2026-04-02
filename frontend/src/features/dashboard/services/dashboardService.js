import api from '../../../services/api';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
};

export default dashboardService;
