import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import ROUTES  from '@/constants/routes';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
