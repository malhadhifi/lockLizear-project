import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   sessionStorage.getItem('auth_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    loginStart: (state) => { state.loading = true; state.error = null },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user    = action.payload.user
      state.token   = action.payload.token
      sessionStorage.setItem('auth_token', action.payload.token)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error   = action.payload
    },
    logout: (state) => {
      state.user  = null
      state.token = null
      sessionStorage.removeItem('auth_token')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
