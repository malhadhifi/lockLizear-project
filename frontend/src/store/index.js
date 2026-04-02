import { configureStore } from '@reduxjs/toolkit'
import authReducer      from '../features/auth/store/authSlice'
import usersReducer     from '../features/users/store/usersSlice'
import documentsReducer from '../features/documents/store/documentsSlice'
import publicationsReducer from '../features/publications/store/publicationsSlice'
import accessReducer    from '../features/access/store/accessSlice'

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    users:        usersReducer,
    documents:    documentsReducer,
    publications: publicationsReducer,
    access:       accessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export default store
