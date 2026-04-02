import api from '../../../services/api';

// ✅ المسارات الحقيقية من باك إند Laravel:
// GET    /api/library/documents          ← قائمة المستندات
// GET    /api/library/documents/{id}     ← تفاصيل مستند
// PUT    /api/library/documents/{id}     ← تحديث مستند
// POST   /api/library/documents/action   ← إجراءات جماعية

const documentService = {
  // ✅ جلب قائمة المستندات مع دعم الفلاتر (sort_by, per_page, show)
  getAll: (params = {}) => api.get('/library/documents', { params }),

  // ✅ جلب تفاصيل مستند واحد
  getById: (id) => api.get(`/library/documents/${id}`),

  // ✅ تحديث بيانات مستند (description, expired, status)
  update: (id, data) => api.put(`/library/documents/${id}`, data),

  // ✅ تنفيذ إجراء جماعي (Suspend / Activate / Delete)
  executeAction: (ids, action) => api.post('/library/documents/action', { ids, action }),

  // ✅ جلب قائمة العملاء المربطين بمستند (Access List)
  getDocumentAccessList: (id) => api.get(`/library/documents/${id}/access`),

  // ✅ تصدير السجلات
  exportCSV: (params = {}) => api.get('/library/documents/export', { params }),
};

export default documentService;
