// =============================================
// usePermissions Hook
// فحص صلاحية عملية معينة للمستخدم الحالي
// =============================================

import { useSelector } from 'react-redux';
import { ROLE_PERMISSIONS } from '../config/permissions.config';

export const usePermissions = () => {
  const { role } = useSelector(state => state.auth);

  const hasPermission = (permission) => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) =>
    permissionList.some(p => hasPermission(p));

  const hasAllPermissions = (permissionList) =>
    permissionList.every(p => hasPermission(p));

  return { hasPermission, hasAnyPermission, hasAllPermissions, role };
};

export default usePermissions;
