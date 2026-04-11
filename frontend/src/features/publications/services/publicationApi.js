import api from '../../../lib/axios';

// دالة مجمّعة (Object) تحتوي على جميع مكالمات API الخاصة بالمنشورات
export const publicationApi = {
  // 1. جلب قائمة المنشورات مع الفلاتر
  getPublications: async (params) => {
    return await api.get('/library/publications', { params });
  },

  // 2. إضافة منشور جديد
  createPublication: async (publicationData) => {
    return await api.post('/library/publications', publicationData);
  },

  // 3. تحديث بيانات منشور أساسية
  updatePublication: async ({ id, ...publicationData }) => {
    return await api.put(`/library/publications/${id}`, publicationData);
  },

  // 4. إجراء مُجمّع (حذف / تعليق مجموعة من المنشورات)
  bulkAction: async (actionData) => {
    return await api.post('/library/publications/bulk-action', actionData);
  },

  // 5. جلب تفاصيل منشور فردي واحد (الذي أنشأناه بالـ API الجديد)
  getPublicationDetails: async (id) => {
    return await api.get(`/library/publications/${id}`);
  },

  // === روابط المستندات الفرعية للمنشور ===
  getPublicationDocuments: async (id) => {
    return await api.get(`/library/publications/${id}/documents`);
  },
  attachDocuments: async ({ id, document_ids }) => {
    return await api.post(`/library/publications/${id}/documents/attach`, { document_ids });
  },
  detachDocument: async ({ id, document_id }) => {
    return await api.delete(`/library/publications/${id}/documents/${document_id}`);
  },

  // === روابط العملاء الفرعية للمنشور ===
  getPublicationSubscribers: async (id) => {
    return await api.get(`/library/publications/${id}/subscribers`);
  },
  revokeSubscriberAccess: async ({ id, customer_ids }) => {
    return await api.post(`/library/publications/${id}/subscribers/revoke`, { customer_ids });
  }
};
