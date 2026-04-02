import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import documentService from '../services/documentService'

// ✅ جلب قائمة المستندات من الباك إند
export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await documentService.getAll(params)
      return res.data.data  // { items, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في جلب المستندات')
    }
  }
)

// ✅ جلب تفاصيل مستند واحد بالـ ID
export const fetchDocumentById = createAsyncThunk(
  'documents/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await documentService.getById(id)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في جلب تفاصيل المستند')
    }
  }
)

// ✅ تحديث بيانات مستند (description / expires / status)
export const updateDocument = createAsyncThunk(
  'documents/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await documentService.update(id, data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في تحديث المستند')
    }
  }
)

// ✅ تنفيذ إجراء جماعي (حذف / إيقاف / تفعيل)
export const executeDocumentAction = createAsyncThunk(
  'documents/executeAction',
  async ({ ids, action }, { dispatch, getState, rejectWithValue }) => {
    try {
      await documentService.executeAction(ids, action)
      const filters = getState().documents.currentFilters
      dispatch(fetchDocuments(filters))
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في تنفيذ الإجراء')
    }
  }
)

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list:            [],     // قائمة المستندات من الباك إند
    currentDocument: null,  // تفاصيل المستند المفتوح حالياً
    pagination:      null,  // بيانات الصفحات
    loading:         false, // تحميل القائمة
    detailLoading:   false, // تحميل صفحة التفاصيل
    error:           null,  // خطأ القائمة
    detailError:     null,  // خطأ صفحة التفاصيل
    currentFilters:  {},    // الفلاتر الحالية لإعادة الجلب بعد الإجراءات
  },
  reducers: {
    setFilters: (state, action) => {
      state.currentFilters = action.payload
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null
      state.detailError = null
    },
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
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // --- fetchDocumentById ---
      .addCase(fetchDocumentById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
        state.currentDocument = null
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.currentDocument = action.payload
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

      // --- updateDocument ---
      .addCase(updateDocument.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.detailLoading = false
        state.currentDocument = action.payload
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

      // --- executeDocumentAction ---
      .addCase(executeDocumentAction.pending, (state) => {
        state.loading = true
      })
      .addCase(executeDocumentAction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(executeDocumentAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, clearCurrentDocument } = documentsSlice.actions
export default documentsSlice.reducer
