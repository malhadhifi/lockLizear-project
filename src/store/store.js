import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/store/authSlice'
import usersReducer from '../features/users/store/usersSlice'
import accessReducer from '../features/access/store/accessSlice'
import publicationsReducer from '../features/publications/store/publicationsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    access: accessReducer,
    publications: publicationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
})

export default store
