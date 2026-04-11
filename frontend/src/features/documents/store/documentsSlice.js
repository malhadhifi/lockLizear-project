import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from '../services/documentService';

// =============================================
// Thunks
// =============================================

export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await documentService.getAll(filters);
      // الباك اند يرجع: { data: { items: [...], total, current_page, last_page, per_page } }
      const payload = res.data?.data ?? res.data ?? {};
      return {
        items:        Array.isArray(payload.items) ? payload.items
                    : Array.isArray(payload)       ? payload
                    : [],
        total:        payload.total        ?? 0,
        current_page: payload.current_page ?? 1,
        last_page:    payload.last_page    ?? 1,
        per_page:     payload.per_page     ?? 25,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to fetch documents'
      );
    }
  }
);

export const fetchDocumentDetails = createAsyncThunk(
  'documents/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await documentService.getById(id);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to fetch document details'
      );
    }
  }
);

export const executeDocumentAction = createAsyncThunk(
  'documents/executeAction',
  async ({ ids, action }, { dispatch, getState, rejectWithValue }) => {
    try {
      await documentService.executeAction(ids, action);
      // إعادة جلب القائمة بنفس الفلاتر الحالية
      const filters = getState().documents.activeFilters;
      dispatch(fetchDocuments(filters));
      return { ids, action };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Action failed'
      );
    }
  }
);

export const exportDocumentsCSV = createAsyncThunk(
  'documents/exportCSV',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await documentService.exportCSV(filters);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `documents-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      return rejectWithValue('Export failed');
    }
  }
);

export const fetchDocumentAccessList = createAsyncThunk(
  'documents/fetchAccessList',
  async (id, { rejectWithValue }) => {
    try {
      const res = await documentService.getAccessList(id);
      return res.data?.data ?? [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to fetch access list'
      );
    }
  }
);

// =============================================
// Slice
// =============================================

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list:    [],
    loading: false,
    error:   null,
    pagination: {
      total:        0,
      current_page: 1,
      last_page:    1,
      per_page:     25,
    },
    activeFilters: {},

    detail:        null,
    detailLoading: false,
    detailError:   null,

    accessList:        [],
    accessListLoading: false,
    accessListError:   null,

    exportLoading: false,
    actionLoading: false,
    actionError:   null,
  },

  reducers: {
    clearDocumentDetail(state) {
      state.detail      = null;
      state.detailError = null;
    },
    clearActionError(state) {
      state.actionError = null;
    },
    setActiveFilters(state, action) {
      state.activeFilters = action.payload;
    },
  },

  extraReducers: (builder) => {

    // fetchDocuments
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading        = false;
        state.list           = action.payload.items;
        state.pagination     = {
          total:        action.payload.total,
          current_page: action.payload.current_page,
          last_page:    action.payload.last_page,
          per_page:     action.payload.per_page,
        };
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // fetchDocumentDetails
    builder
      .addCase(fetchDocumentDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError   = null;
      })
      .addCase(fetchDocumentDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail        = action.payload;
      })
      .addCase(fetchDocumentDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError   = action.payload;
      });

    // executeDocumentAction
    builder
      .addCase(executeDocumentAction.pending, (state) => {
        state.actionLoading = true;
        state.actionError   = null;
      })
      .addCase(executeDocumentAction.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(executeDocumentAction.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError   = action.payload;
      });

    // exportDocumentsCSV
    builder
      .addCase(exportDocumentsCSV.pending, (state) => {
        state.exportLoading = true;
      })
      .addCase(exportDocumentsCSV.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportDocumentsCSV.rejected, (state) => {
        state.exportLoading = false;
      });

    // fetchDocumentAccessList
    builder
      .addCase(fetchDocumentAccessList.pending, (state) => {
        state.accessListLoading = true;
        state.accessListError   = null;
      })
      .addCase(fetchDocumentAccessList.fulfilled, (state, action) => {
        state.accessListLoading = false;
        state.accessList        = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDocumentAccessList.rejected, (state, action) => {
        state.accessListLoading = false;
        state.accessListError   = action.payload;
      });
  },
});

export const {
  clearDocumentDetail,
  clearActionError,
  setActiveFilters,
} = documentsSlice.actions;

export default documentsSlice.reducer;
