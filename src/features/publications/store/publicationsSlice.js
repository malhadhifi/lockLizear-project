import { createSlice } from '@reduxjs/toolkit';
const publicationsSlice = createSlice({ name: 'publications', initialState: { list: [], selectedPublication: null, loading: false, error: null }, reducers: {} });
export default publicationsSlice.reducer;
