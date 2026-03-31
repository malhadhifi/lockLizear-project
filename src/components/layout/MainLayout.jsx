import { Outlet } from 'react-router-dom'
import Header from './Header'

const MainLayout = () => (
  <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
    <Header />
    <main style={{ padding: '0 20px 20px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <Outlet />
    </main>
  </div>
)

export default MainLayout
