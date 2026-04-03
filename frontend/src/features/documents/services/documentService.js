import { api } from '../../../lib/axios';

/**
 * documentService.js
 * خدمة المستندات — كل طلبات HTTP الخاصة بـ feature المستندات.
 *
 * المسارات الحقيقية من باك إند Laravel:
 *   GET  /api/library/documents           ← قائمة المستندات (مع فلاتر + pagination)
 *   GET  /api/library/documents/{id}      ← تفاصيل مستند
 *   PUT  /api/library/documents/{id}      ← تحديث مستند
 *   POST /api/library/documents/action    ← إجراءات جماعية (suspend/activate/delete)
 *   GET  /api/library/documents/{id}/access ← قائمة الوصول (العملاء)
 *   GET  /api/library/documents/export    ← تصدير CSV
 */

const documentService = {
  // جلب قائمة المستندات مع دعم الفلاتر
  getAll: (params = {}) =>
    api.get('/library/documents', { params }),

  // جلب تفاصيل مستند واحد
  getById: (id) =>
    api.get(`/library/documents/${id}`),

  // تحديث بيانات مستند
  update: (id, data) =>
    api.put(`/library/documents/${id}`, data),

  // تنفيذ إجراء جماعي
  // FIX: action يُحوَّل لأحرف صغيرة هنا — Suspend→suspend، Activate→activate، Delete→delete
  executeAction: (ids, action) =>
    api.post('/library/documents/action', {
      document_ids: ids,
      action: action.toLowerCase(),
    }),

  // جلب قائمة الوصول (العملاء المصرح لهم) لمستند معين
  // FIX: أُضيف alias getAccessList لتوافق useDocuments.js القديم
  getDocumentAccessList: (id) =>
    api.get(`/library/documents/${id}/access`),

  // alias للتوافق مع أي كود قديم يستدعي getAccessList
  get getAccessList() {
    return this.getDocumentAccessList
  },

  // تصدير السجلات CSV
  exportCSV: (params = {}) =>
    api.get('/library/documents/export', { params, responseType: 'blob' }),
};

export default documentService;
