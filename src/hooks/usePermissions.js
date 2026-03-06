import { useSelector } from 'react-redux';
import { ROLE_PERMISSIONS } from '@/config/permissions.config';

export const usePermissions = () => {
  const { role } = useSelector((s) => s.auth);
  const permissions = ROLE_PERMISSIONS[role] || [];

  const can = (permission) => permissions.includes(permission);
  const canAny = (perms) => perms.some((p) => permissions.includes(p));
  const canAll = (perms) => perms.every((p) => permissions.includes(p));

  return { can, canAny, canAll, permissions, role };
};

export default usePermissions;
