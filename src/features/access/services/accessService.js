import api from '../../../services/api';

const accessService = {
  getUserAccess: async (userId) => {
    return await api.get(`/users/${userId}/access`);
  },

  saveProperties: async (userId, data) => {
    return await api.put(`/users/${userId}/access/properties`, data);
  },

  saveDocumentAccess: async (userId, data) => {
    return await api.put(`/users/${userId}/access/documents`, data);
  },

  savePublicationAccess: async (userId, data) => {
    return await api.put(`/users/${userId}/access/publications`, data);
  },

  revokeAllAccess: async (userId) => {
    return await api.delete(`/users/${userId}/access`);
  }
};

export default accessService;
