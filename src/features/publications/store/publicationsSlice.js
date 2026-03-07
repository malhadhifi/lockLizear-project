import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import publicationService from '../services/publicationService';

export const fetchPublications = createAsyncThunk('publications/fetchAll', async (params) => {
  return await publicationService.getAll(params);
});

const publicationsSlice = createSlice({
  name: 'publications',
  initialState: {
    list: [],
    selectedPublication: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default publicationsSlice.reducer;
