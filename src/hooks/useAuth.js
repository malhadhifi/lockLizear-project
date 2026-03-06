// =============================================
// useAuth Hook
// بيانات المستخدم المسجّل وحالة المصادقة
// =============================================

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/store/authSlice';
import ROUTES from '../constants/routes';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, role, loading, isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    logout: handleLogout,
  };
};

export default useAuth;
