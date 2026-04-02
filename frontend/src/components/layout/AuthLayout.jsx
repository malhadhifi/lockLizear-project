import { Outlet } from 'react-router-dom'

const AuthLayout = () => (
  <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100"
    style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
    <Outlet />
  </div>
)

export default AuthLayout
