import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from '../services/documentService';

export const fetchDocuments = createAsyncThunk('documents/fetchAll', async (params) => {
  return await documentService.getAll(params);
});

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    list: [],
    selectedDocument: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default documentsSlice.reducer;
