import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout            from './components/layout/MainLayout'
import AuthLayout            from './components/layout/AuthLayout'
import PrivateRoute          from './routes/PrivateRoute'
import LoginPage             from './features/auth/pages/LoginPage'
import DashboardPage         from './features/dashboard/pages/DashboardPage'
import UsersListPage         from './features/users/pages/UsersListPage'
import UserDetailPage        from './features/users/pages/UserDetailPage'
import CreateUserPage        from './features/users/pages/CreateUserPage'
import DocumentsListPage     from './features/documents/pages/DocumentsListPage'
import DocumentDetailPage    from './features/documents/pages/DocumentDetailPage'
import PublicationsListPage  from './features/publications/pages/PublicationsListPage'
import CreatePublicationPage from './features/publications/pages/CreatePublicationPage'
import EditPublicationPage   from './features/publications/pages/EditPublicationPage'
import AccessControlPage     from './features/access/pages/AccessControlPage'
import EmailManagementPage   from './features/emails/pages/EmailManagementPage'
import SubAdminsListPage     from './features/sub_admins/pages/SubAdminsListPage'
import ReportsPage           from './features/reports/pages/ReportsPage'
import SettingsPage          from './features/settings/pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/"                       element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"              element={<DashboardPage />} />
        <Route path="/users"                  element={<UsersListPage />} />
        <Route path="/users/create"           element={<CreateUserPage />} />
        <Route path="/users/:id"              element={<UserDetailPage />} />
        <Route path="/documents"              element={<DocumentsListPage />} />
        <Route path="/documents/:id"          element={<DocumentDetailPage />} />
        <Route path="/publications"           element={<PublicationsListPage />} />
        <Route path="/publications/create"    element={<CreatePublicationPage />} />
        <Route path="/publications/:id/edit"  element={<EditPublicationPage />} />
        <Route path="/access"                 element={<AccessControlPage />} />
        <Route path="/emails"                 element={<EmailManagementPage />} />
        <Route path="/sub-admins"             element={<SubAdminsListPage />} />
        <Route path="/reports"                element={<ReportsPage />} />
        <Route path="/settings"               element={<SettingsPage />} />
        <Route path="*"                       element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
