import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute   from './RoleRoute';
import ROUTES      from '@/constants/routes';
import ROLES       from '@/config/roles.config';

// Pages
import LoginPage          from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import DashboardPage      from '@/features/dashboard/pages/DashboardPage';
import UsersListPage      from '@/features/users/pages/UsersListPage';
import UserDetailPage     from '@/features/users/pages/UserDetailPage';
import CreateUserPage     from '@/features/users/pages/CreateUserPage';
import DocumentsListPage  from '@/features/documents/pages/DocumentsListPage';
import DocumentDetailPage from '@/features/documents/pages/DocumentDetailPage';
import PublicationsListPage  from '@/features/publications/pages/PublicationsListPage';
import CreatePublicationPage from '@/features/publications/pages/CreatePublicationPage';
import EditPublicationPage   from '@/features/publications/pages/EditPublicationPage';
import AccessControlPage  from '@/features/access/pages/AccessControlPage';
import EmailManagementPage from '@/features/emails/pages/EmailManagementPage';
import SubAdminsListPage  from '@/features/sub_admins/pages/SubAdminsListPage';
import CreateSubAdminPage from '@/features/sub_admins/pages/CreateSubAdminPage';
import ReportsPage   from '@/features/reports/pages/ReportsPage';
import ViewLogsPage  from '@/features/reports/pages/ViewLogsPage';
import AdminLogsPage from '@/features/reports/pages/AdminLogsPage';
import SettingsPage  from '@/features/settings/pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD}          element={<DashboardPage />} />
          <Route path={ROUTES.USERS}              element={<UsersListPage />} />
          <Route path={ROUTES.USERS_CREATE}       element={<CreateUserPage />} />
          <Route path={ROUTES.USER_DETAIL}        element={<UserDetailPage />} />
          <Route path={ROUTES.DOCUMENTS}          element={<DocumentsListPage />} />
          <Route path={ROUTES.DOCUMENT_DETAIL}    element={<DocumentDetailPage />} />
          <Route path={ROUTES.PUBLICATIONS}       element={<PublicationsListPage />} />
          <Route path={ROUTES.PUBLICATIONS_CREATE}element={<CreatePublicationPage />} />
          <Route path={ROUTES.PUBLICATION_EDIT}   element={<EditPublicationPage />} />
          <Route path={ROUTES.ACCESS_CONTROL}     element={<AccessControlPage />} />
          <Route path={ROUTES.EMAILS}             element={<EmailManagementPage />} />
          <Route path={ROUTES.REPORTS}            element={<ReportsPage />} />
          <Route path={ROUTES.VIEW_LOGS}          element={<ViewLogsPage />} />
          <Route path={ROUTES.ADMIN_LOGS}         element={<AdminLogsPage />} />
          {/* Super Admin only */}
          <Route element={<RoleRoute allowed={[ROLES.SUPER_ADMIN]} />}>
            <Route path={ROUTES.SUB_ADMINS}        element={<SubAdminsListPage />} />
            <Route path={ROUTES.SUB_ADMINS_CREATE} element={<CreateSubAdminPage />} />
            <Route path={ROUTES.SETTINGS}          element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
