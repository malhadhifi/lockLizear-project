import api from '@/services/api';
import appConfig from '@/config/app.config';

const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem(appConfig.tokenKey, data.token);
    return data;
  },
  async logout() {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem(appConfig.tokenKey);
  },
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  async resetPassword(payload) {
    const { data } = await api.post('/auth/reset-password', payload);
    return data;
  },
};

export default authService;
