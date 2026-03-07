import { createSlice } from '@reduxjs/toolkit';
const accessSlice = createSlice({ name: 'access', initialState: { selectedUser: null, properties: {}, documents: [], publications: [], loading: false, error: null }, reducers: {} });
export default accessSlice.reducer;
