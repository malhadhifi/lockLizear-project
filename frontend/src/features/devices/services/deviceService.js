import api from '../../../services/api';
const deviceService = {
  getUserDevices: (userId) => api.get(`/users/${userId}/devices`),
  revokeDevice: (deviceId) => api.delete(`/devices/${deviceId}`),
  revokeAllDevices: (userId) => api.delete(`/users/${userId}/devices`),
};
export default deviceService;
