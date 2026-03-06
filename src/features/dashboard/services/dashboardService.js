import api from '@/services/api';

const dashboardService = {
  async getStats()         { const { data } = await api.get('/dashboard/stats');    return data; },
  async getRecentActivity(){ const { data } = await api.get('/dashboard/activity'); return data; },
};

export default dashboardService;
