import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import ROUTES  from '@/constants/routes';

export default function RoleRoute({ allowed = [] }) {
  const { role } = useAuth();
  return allowed.includes(role) ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
}
