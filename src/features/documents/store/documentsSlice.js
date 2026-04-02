/**
 * ملف: documentsSlice.js
 * الوظيفة: إدارة حالة (State) المستندات على مستوى التطبيق (Redux)
 * الوصف:
 * - يحتوي هذا الملف على شريحة (Slice) المستندات التي ستستخدم لاحقاً للربط مع الـ API الخارجي.
 * - حالياً، نقوم بتجهيزه ببيانات وهمية (Mock Data) والوظائف الأساسية لتجربة واجهة المستخدم.
 * - تمت إضافة تعليقات باللغة العربية لشرح وظيفية جميع أجزاء الكود.
 */

import { createSlice } from '@reduxjs/toolkit'

// توحيد مصدر البيانات الوهمية (Mock Data) ليكون هنا بدلاً من المكونات
const MOCK_DOCUMENTS = [
  { id: 101, name: 'تقرير المبيعات السنوي.pdf', description: 'تقرير سري ومشفّر لمبيعات الربع الأول من العام.', publishedDate: '2026-03-15', status: 'valid', expires: '2027-03-15', customersCount: 45, publicationsCount: 2, drm: { printingEnabled: false, viewingWatermark: true, printingWatermark: false, lockToDevice: true, trackUsage: true } },
  { id: 102, name: 'الكود المصدري للمشروع.zip', description: 'يحتوي على الأكواد الكاملة بتشفير عالي.', publishedDate: '2026-02-28', status: 'suspended', expires: '', customersCount: 12, publicationsCount: 1, drm: { printingEnabled: false, viewingWatermark: false, printingWatermark: false, lockToDevice: true, trackUsage: true } },
  { id: 103, name: 'دليل المستخدم الإصدار 5.pdf', description: 'الدليل الأصلي للإصدار الخامس من لوك ليزارد.', publishedDate: '2025-01-10', status: 'expired', expires: '2026-01-10', customersCount: 120, publicationsCount: 0, drm: { printingEnabled: true, viewingWatermark: true, printingWatermark: true, lockToDevice: false, trackUsage: false } },
  { id: 104, name: 'خطة التسويق السرية.pdf', description: 'توزيع خطة التسويق للمدراء فقط.', publishedDate: '2026-04-01', status: 'valid', expires: '', customersCount: 5, publicationsCount: 1, drm: { printingEnabled: false, viewingWatermark: true, printingWatermark: false, lockToDevice: true, trackUsage: true } },
]

export const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list: MOCK_DOCUMENTS, // قائمة المستندات المحملة
    loading: false,       // حالة التحميل (للاستخدام لاحقاً مع الـ API)
    error: null,          // الأخطاء الواردة (للاستخدام لاحقاً)
  },
  reducers: {
    // تحديث بيانات مستند معين (مثل الوصف وتاريخ الانتهاء)
    updateDocument: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload }
      }
    },
    // تغيير حالة ملفات متعددة دفعة واحدة (موقوف، مفعل)
    updateDocumentsStatus: (state, action) => {
      const { ids, status } = action.payload
      state.list = state.list.map(doc => 
        ids.includes(doc.id) ? { ...doc, status } : doc
      )
    },
    // إزالة ملفات متعددة دفعة واحدة (حذف)
    deleteDocuments: (state, action) => {
      const { ids } = action.payload
      state.list = state.list.filter(doc => !ids.includes(doc.id))
    }
  }
})

// استخراج وصناعة الأوامر المتاحة للاستخدام في الواجهات
export const { updateDocument, updateDocumentsStatus, deleteDocuments } = documentsSlice.actions

export default documentsSlice.reducer
