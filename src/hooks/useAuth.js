import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/store/authSlice';
import ROUTES from '@/constants/routes';

export const useAuth = () => {
  const { user, token, role, loading } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return { user, token, role, loading, isAuthenticated: !!token, handleLogout };
};

export default useAuth;
