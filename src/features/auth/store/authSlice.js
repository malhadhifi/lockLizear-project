import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null, token: null, role: null, loading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => Object.assign(state, action.payload),
    setAuthLoading: (state, action) => { state.loading = action.payload; },
    setAuthError: (state, action) => { state.error = action.payload; },
    logout: () => initialState,
  },
});

export const { setCredentials, setAuthLoading, setAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
