import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout'

// Auth Pages
import Login from '../features/auth/pages/Login'

// Feature Pages (Lazy loaded)
import { lazy, Suspense } from 'react'
import Loader from '../components/common/Loader'

const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard'))
const Users = lazy(() => import('../features/users/pages/Users'))
const Videos = lazy(() => import('../features/videos/pages/Videos'))
const Publications = lazy(() => import('../features/publications/pages/Publications'))
const Reports = lazy(() => import('../features/reports/pages/Reports'))
const AccessControl = lazy(() => import('../features/access/pages/AccessControl'))
const Settings = lazy(() => import('../features/settings/pages/Settings'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" />
  </div>
)

function AppRoutes() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="videos" element={<Videos />} />
          <Route path="publications" element={<Publications />} />
          <Route path="reports" element={<Reports />} />
          <Route path="access" element={<AccessControl />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
