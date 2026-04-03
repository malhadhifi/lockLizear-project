import { api } from '../../../lib/axios';

/**
 * documentService.js
 * نمط موحّد مع publicationApi.js:
 *   كل دالة تفكّ axios wrapper وترجع data مباشرةً
 *   حتى تكون data من useQuery = Laravel response body مباشرةً
 *
 * المسارات:
 *   GET  /api/library/documents             ← قائمة + pagination
 *   GET  /api/library/documents/{id}        ← تفاصيل مستند
 *   PUT  /api/library/documents/{id}        ← تحديث مستند
 *   POST /api/library/documents/action      ← إجراءات جماعية
 *   GET  /api/library/documents/{id}/access ← قائمة الوصول
 *   GET  /api/library/documents/export      ← تصدير CSV (blob)
 */

const documentService = {
  // جلب القائمة — يرجع data مباشرةً (مثل publicationApi)
  getAll: async (params = {}) => {
    const { data } = await api.get('/library/documents', { params });
    return data;
  },

  // تفاصيل مستند واحد
  getById: async (id) => {
    const { data } = await api.get(`/library/documents/${id}`);
    return data;
  },

  // تحديث مستند
  update: async (id, payload) => {
    const { data } = await api.put(`/library/documents/${id}`, payload);
    return data;
  },

  // إجراء جماعي — action يُحوَّل لأحرف صغيرة دائماً
  executeAction: async (ids, action) => {
    const { data } = await api.post('/library/documents/action', {
      document_ids: ids,
      action: action.toLowerCase(),
    });
    return data;
  },

  // قائمة الوصول
  getDocumentAccessList: async (id) => {
    const { data } = await api.get(`/library/documents/${id}/access`);
    return data;
  },

  // alias للتوافق مع أي كود قديم
  get getAccessList() {
    return this.getDocumentAccessList;
  },

  // تصدير CSV — يرجع axios response كاملاً لأن responseType blob
  exportCSV: (params = {}) =>
    api.get('/library/documents/export', { params, responseType: 'blob' }),
};

export default documentService;
