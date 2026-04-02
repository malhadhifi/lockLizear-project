import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import documentService from '../services/documentService'

// ✅ جلب القائمة من الباك إند
export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (params) => {
    const res = await documentService.getAll(params)
    return res.data.data  // { items, pagination }
  }
)

// ✅ تنفيذ إجراء جماعي (حذف / إيقاف / تفعيل)
export const executeDocumentAction = createAsyncThunk(
  'documents/executeAction',
  async ({ ids, action }, { dispatch, getState }) => {
    await documentService.executeAction(ids, action)
    // بعد العملية نعيد جلب القائمة بنفس الفلاتر الحالية
    const filters = getState().documents.currentFilters
    dispatch(fetchDocuments(filters))
  }
)

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list: [],          // القائمة تجي من الباك إند (مش mock)
    pagination: null,  // بيانات الصفحات
    loading: false,    // حالة التحميل
    error: null,       // الأخطاء
    currentFilters: {} // نحفظ الفلاتر الحالية لإعادة الجلب بعد الإجراءات
  },
  reducers: {
    // حفظ الفلاتر الحالية
    setFilters: (state, action) => {
      state.currentFilters = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchDocuments ---
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.items
        state.pagination = action.payload.pagination
      })
      .addCase(fetchDocuments.rejected, (state) => {
        state.loading = false
        state.error = 'حدث خطأ في جلب البيانات'
      })

      // --- executeDocumentAction ---
      .addCase(executeDocumentAction.pending, (state) => {
        state.loading = true
      })
      .addCase(executeDocumentAction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(executeDocumentAction.rejected, (state) => {
        state.loading = false
        state.error = 'حدث خطأ في تنفيذ الإجراء'
      })
  }
})

export const { setFilters } = documentsSlice.actions
export default documentsSlice.reducer
