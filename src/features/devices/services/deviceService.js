import api from '../../../services/api';

const deviceService = {
  getUserDevices: async (userId) => {
    return await api.get(`/users/${userId}/devices`);
  },

  revokeDevice: async (deviceId) => {
    return await api.delete(`/devices/${deviceId}`);
  },

  revokeAllDevices: async (userId) => {
    return await api.delete(`/users/${userId}/devices`);
  }
};

export default deviceService;
