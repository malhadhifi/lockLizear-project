import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/store/authSlice'
import usersReducer from '../features/users/store/usersSlice'
import videosReducer from '../features/videos/store/videosSlice'
import publicationsReducer from '../features/publications/store/publicationsSlice'
import reportsReducer from '../features/reports/store/reportsSlice'
import accessReducer from '../features/access/store/accessSlice'
import settingsReducer from '../features/settings/store/settingsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    videos: videosReducer,
    publications: publicationsReducer,
    reports: reportsReducer,
    access: accessReducer,
    settings: settingsReducer,
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
