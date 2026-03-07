import { createSlice } from '@reduxjs/toolkit';
const initialState = { list: [], selectedUser: null, loading: false, error: null, pagination: {} };
const usersSlice = createSlice({ name: 'users', initialState, reducers: {} });
export default usersSlice.reducer;
