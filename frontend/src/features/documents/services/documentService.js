import { api } from '../../../lib/axios';

/**
 * documentService.js
 *
 * كل دالة ترجع axios response كامل (res)
 * حتى يستطيع documentsSlice قراءة res.data.data
 *
 * المسارات:
 *   GET  /api/library/documents             ← قائمة + pagination
 *   GET  /api/library/documents/{id}        ← تفاصيل مستند
 *   PUT  /api/library/documents/{id}        ← تحديث مستند
 *   POST /api/library/documents/action      ← إجراءات جماعية
 *   GET  /api/library/documents/{id}/access ← قائمة الوصول
 *   GET  /api/library/documents/export      ← تصدير CSV
 */

const documentService = {
  /** جلب القائمة — يرجع axios response كامل */
  getAll: (params = {}) =>
    api.get('/library/documents', { params }),

  /** تفاصيل مستند واحد */
  getById: (id) =>
    api.get(`/library/documents/${id}`),

  /** تحديث مستند */
  update: (id, payload) =>
    api.put(`/library/documents/${id}`, payload),

  /** إجراء جماعي — action يُحوَّل لأحرف صغيرة دائماً */
  executeAction: (ids, action) =>
    api.post('/library/documents/action', {
      document_ids: ids,
      action: action.toLowerCase(),
    }),

  /** قائمة العملاء المصرح لهم بالوصول */
  getAccessList: (id) =>
    api.get(`/library/documents/${id}/access`),

  /** تصدير CSV — يرجع axios response كامل لأن responseType: blob */
  exportCSV: (params = {}) =>
    api.get('/library/documents/export', { params, responseType: 'blob' }),
};

export default documentService;
