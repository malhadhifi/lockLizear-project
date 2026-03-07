import { createSlice } from '@reduxjs/toolkit';
const documentsSlice = createSlice({ name: 'documents', initialState: { list: [], selectedDocument: null, loading: false, error: null }, reducers: {} });
export default documentsSlice.reducer;
