import { combineReducers } from '@reduxjs/toolkit';
import auth from '../features/auth/store/authSlice';
import users from '../features/users/store/usersSlice';
import documents from '../features/documents/store/documentsSlice';
import access from '../features/access/store/accessSlice';
import devices from '../features/devices/store/devicesSlice';

const rootReducer = combineReducers({ auth, users, documents, access, devices });
export default rootReducer;
