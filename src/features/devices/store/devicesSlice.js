import { createSlice } from '@reduxjs/toolkit';
const devicesSlice = createSlice({ name: 'devices', initialState: { list: [], loading: false, error: null }, reducers: {} });
export default devicesSlice.reducer;
