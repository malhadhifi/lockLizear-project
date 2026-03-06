// =============================================
// Axios API Instance + Interceptors
// إعداد Axios مع التوكن وإعادة التوجيه
// =============================================

import axios from 'axios';
import { APP_CONFIG } from '../config/app.config';

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor — إضافة التوكن لكل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — معالجة الأخطاء العامة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Token expired — clear and redirect
      localStorage.removeItem('drm_token');
      localStorage.removeItem('drm_user');
      window.location.href = '/login';
    }
    if (status === 403) {
      console.error('Access Forbidden: You do not have permission.');
    }
    return Promise.reject(error);
  }
);

export default api;
