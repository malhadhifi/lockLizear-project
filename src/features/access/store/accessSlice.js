import { createSlice } from '@reduxjs/toolkit';

const accessSlice = createSlice({
  name: 'access',
  initialState: {
    selectedUserId: null,
    userAccess: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload;
    }
  }
});

export const { setSelectedUser } = accessSlice.actions;
export default accessSlice.reducer;
