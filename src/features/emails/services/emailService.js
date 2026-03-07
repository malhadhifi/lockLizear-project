import api from '../../../services/api';
const emailService = {
  resendLicense: (userId) => api.post(`/emails/license/${userId}/resend`),
  resendLicenseBulk: (userIds) => api.post('/emails/license/resend-bulk', { userIds }),
  resendToUnregistered: () => api.post('/emails/unregistered/resend'),
  getDeliveryStatus: (userId) => api.get(`/emails/delivery-status/${userId}`),
  getUndeliveredEmails: () => api.get('/emails/undelivered'),
};
export default emailService;
