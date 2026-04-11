import api from '../../../services/api';

const authService = {
  login: (data) => api.post('/publisher/login', data),
  logout: () => api.post('/publisher/logout'),
  getMe: () => api.get('/publisher/me'),
  refreshToken: () => api.post('/publisher/refresh'),
};

export default authService;
