import api from '../../../services/api';
const accessService = {
  getUserAccess: (userId) => api.get(`/access/${userId}`),
  saveProperties: (userId, data) => api.put(`/access/${userId}/properties`, data),
  saveDocumentAccess: (userId, data) => api.put(`/access/${userId}/documents`, data),
  savePublicationAccess: (userId, data) => api.put(`/access/${userId}/publications`, data),
  revokeAllAccess: (userId) => api.delete(`/access/${userId}`),
};
export default accessService;
