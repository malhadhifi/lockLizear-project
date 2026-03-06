import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

export const loginThunk = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try   { return await authService.login(creds); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try   { return await authService.getMe(); }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('drm_admin_token'), role: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null; state.role = null;
      localStorage.removeItem('drm_admin_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginThunk.fulfilled, (s, { payload }) => {
        s.loading = false; s.token = payload.token;
        s.user = payload.user; s.role = payload.user?.role;
      })
      .addCase(loginThunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(getMeThunk.fulfilled, (s, { payload }) => {
        s.user = payload; s.role = payload?.role;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
