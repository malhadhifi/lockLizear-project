/**
 * ملف: documentsSlice.js
 * المسار: frontend/src/features/documents/store/documentsSlice.js
 *
 * ملاحظة: هذا الـ slice أصبح احتياطياً (legacy) بعد الترحيل لـ React Query.
 * يُبقى هنا فقط إذا احتاجت مكونات أخرى لـ Redux state من المستندات.
 * الصفحات الرئيسية (DocumentsListPage, DocumentDetailPage) تستخدم الآن
 * hooks من useDocuments.js مباشرةً.
 *
 * FIX 1: fetchDocuments.fulfilled — دعم بنية الاستجابة الحقيقية من Laravel:
 *   { data: { data: [...], meta: { current_page, last_page, total, ... } } }
 *   أو مصفوفة مباشرة للتوافق العكسي.
 *
 * FIX 2: executeDocumentAction — يُرجع الآن قيمة صريحة ليعمل مع .unwrap()
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import documentService from '../services/documentService'

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await documentService.getAll(params)
      const payload = res.data?.data ?? res.data ?? {}

      // FIX: الاستجابة من Laravel تأتي بشكل { data: [...], meta: {...} }
      // وليس { items: [...], pagination: {...} }
      if (Array.isArray(payload)) {
        // مصفوفة مباشرة (بدون pagination)
        return { items: payload, pagination: null }
      }
      return {
        items:      payload.data       ?? payload.items ?? [],
        pagination: payload.meta       ?? payload.pagination ?? null,
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في جلب المستندات')
    }
  }
)

export const fetchDocumentById = createAsyncThunk(
  'documents/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await documentService.getById(id)
      return res.data?.data ?? res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في جلب تفاصيل المستند')
    }
  }
)

export const updateDocument = createAsyncThunk(
  'documents/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await documentService.update(id, data)
      return res.data?.data ?? res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في تحديث المستند')
    }
  }
)

export const executeDocumentAction = createAsyncThunk(
  'documents/executeAction',
  async ({ ids, action }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await documentService.executeAction(ids, action)
      // FIX: dispatch إعادة الجلب ثم إرجاع قيمة صريحة لدعم .unwrap()
      const filters = getState().documents.currentFilters
      dispatch(fetchDocuments(filters))
      return res.data ?? { success: true }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'حدث خطأ في تنفيذ الإجراء')
    }
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list:            [],
    currentDocument: null,
    pagination:      null,
    loading:         false,
    detailLoading:   false,
    error:           null,
    detailError:     null,
    currentFilters:  {},
  },
  reducers: {
    setFilters: (state, action) => {
      state.currentFilters = action.payload
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null
      state.detailError     = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDocuments
      .addCase(fetchDocuments.pending,   (state) => { state.loading = true;  state.error = null })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading    = false
        state.list       = action.payload.items      // ✅ دائماً مصفوفة
        state.pagination = action.payload.pagination // ✅ meta أو null
      })
      .addCase(fetchDocuments.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      // fetchDocumentById
      .addCase(fetchDocumentById.pending,   (state) => { state.detailLoading = true; state.detailError = null; state.currentDocument = null })
      .addCase(fetchDocumentById.fulfilled, (state, action) => { state.detailLoading = false; state.currentDocument = action.payload })
      .addCase(fetchDocumentById.rejected,  (state, action) => { state.detailLoading = false; state.detailError = action.payload })

      // updateDocument
      .addCase(updateDocument.pending,   (state) => { state.detailLoading = true })
      .addCase(updateDocument.fulfilled, (state, action) => { state.detailLoading = false; state.currentDocument = action.payload })
      .addCase(updateDocument.rejected,  (state, action) => { state.detailLoading = false; state.detailError = action.payload })

      // executeDocumentAction
      .addCase(executeDocumentAction.pending,   (state) => { state.loading = true })
      .addCase(executeDocumentAction.fulfilled, (state) => { state.loading = false })
      .addCase(executeDocumentAction.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { setFilters, clearCurrentDocument } = documentsSlice.actions
export default documentsSlice.reducer
