import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try   { return await userService.getAll(params); }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchUserById = createAsyncThunk('users/fetchById', async (id, { rejectWithValue }) => {
  try   { return await userService.getById(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [], selectedUser: null, loading: false, error: null,
    pagination: { total: 0, page: 1, pageSize: 15, totalPages: 0 },
  },
  reducers: {
    setSelectedUser: (s, { payload }) => { s.selectedUser = payload; },
    clearSelectedUser: (s) => { s.selectedUser = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.data || payload;
        if (payload.meta) s.pagination = { total: payload.meta.total, page: payload.meta.current_page,
          pageSize: payload.meta.per_page, totalPages: payload.meta.last_page };
      })
      .addCase(fetchUsers.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchUserById.fulfilled, (s, { payload }) => { s.selectedUser = payload; });
  },
});

export const { setSelectedUser, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
