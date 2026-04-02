import { Outlet } from 'react-router-dom'
import Header from './Header'

function DashboardLayout() {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* Top Header Navigation (LockLizard Style translated to Arabic) */}
      <Header />

      {/* Main Content Area */}
      <main style={{ padding: '0 20px 20px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
