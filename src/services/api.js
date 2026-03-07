import axios from 'axios';
import appConfig from '../config/app.config';

const api = axios.create({
  baseURL: appConfig.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
