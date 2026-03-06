// =============================================
// Root Reducer — دمج كل الـ Slices
// =============================================

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import usersReducer from '../features/users/store/usersSlice';
import documentsReducer from '../features/documents/store/documentsSlice';
import publicationsReducer from '../features/publications/store/publicationsSlice';
import accessReducer from '../features/access/store/accessSlice';
import devicesReducer from '../features/devices/store/devicesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  documents: documentsReducer,
  publications: publicationsReducer,
  access: accessReducer,
  devices: devicesReducer,
});

export default rootReducer;
