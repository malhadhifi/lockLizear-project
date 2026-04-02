import api from '../../../lib/axios';

// دالة مجمّعة (Object) تحتوي على جميع مكالمات API الخاصة بالمنشورات
export const publicationApi = {
  // 1. جلب قائمة المنشورات مع الفلاتر
  getPublications: async (params) => {
    const { data } = await api.get('/library/publications', { params });
    return data;
  },

  // 2. إضافة منشور جديد
  createPublication: async (publicationData) => {
    const { data } = await api.post('/library/publications', publicationData);
    return data;
  },

  // 3. تحديث بيانات منشور أساسية
  updatePublication: async ({ id, ...publicationData }) => {
    const { data } = await api.put(`/library/publications/${id}`, publicationData);
    return data;
  },

  // 4. إجراء مُجمّع (حذف / تعليق مجموعة من المنشورات)
  bulkAction: async (actionData) => {
    const { data } = await api.post('/library/publications/bulk-action', actionData);
    return data;
  },

  // 5. جلب تفاصيل منشور فردي واحد (الذي أنشأناه بالـ API الجديد)
  getPublicationDetails: async (id) => {
    const { data } = await api.get(`/library/publications/${id}`);
    return data;
  },

  // === روابط المستندات الفرعية للمنشور ===
  getPublicationDocuments: async (id) => {
    const { data } = await api.get(`/library/publications/${id}/documents`);
    return data;
  },
  attachDocuments: async ({ id, document_ids }) => {
    const { data } = await api.post(`/library/publications/${id}/documents/attach`, { document_ids });
    return data;
  },
  detachDocument: async ({ id, document_id }) => {
    const { data } = await api.delete(`/library/publications/${id}/documents/${document_id}`);
    return data;
  },

  // === روابط العملاء الفرعية للمنشور ===
  getPublicationSubscribers: async (id) => {
    const { data } = await api.get(`/library/publications/${id}/subscribers`);
    return data;
  },
  revokeSubscriberAccess: async ({ id, customer_ids }) => {
    const { data } = await api.post(`/library/publications/${id}/subscribers/revoke`, { customer_ids });
    return data;
  }
};
