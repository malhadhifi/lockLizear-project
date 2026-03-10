import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header  from './Header'

const MainLayout = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div className="drm-main">
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  </div>
)

export default MainLayout
