import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard':    { title: 'Dashboard',        icon: 'bi-grid-fill' },
  '/users':        { title: 'Users Management', icon: 'bi-people-fill' },
  '/documents':    { title: 'Documents',         icon: 'bi-play-circle-fill' },
  '/publications': { title: 'Publications',      icon: 'bi-collection-fill' },
  '/access':       { title: 'Access Control',    icon: 'bi-shield-lock-fill' },
  '/emails':       { title: 'Email Management',  icon: 'bi-envelope-fill' },
  '/sub-admins':   { title: 'Sub Admins',        icon: 'bi-person-badge-fill' },
  '/reports':      { title: 'Reports & Logs',    icon: 'bi-bar-chart-fill' },
  '/settings':     { title: 'Settings',          icon: 'bi-gear-fill' },
}

const Header = () => {
  const location = useLocation()
  const base     = '/' + location.pathname.split('/')[1]
  const current  = pageTitles[base] || { title: 'DRM Panel', icon: 'bi-house-fill' }

  return (
    <header className="drm-header">
      <div>
        <h1 className="page-title">
          <i className={`bi ${current.icon} me-2`}
            style={{ color: 'var(--primary)', fontSize: '20px' }} />
          {current.title}
        </h1>
      </div>

      <div className="header-actions">
        {/* Search */}
        <div className="drm-search" style={{ width: '220px' }}>
          <i className="bi bi-search" />
          <input type="text" className="form-control" placeholder="Quick search..." />
        </div>

        {/* Notifications */}
        <button className="header-icon-btn">
          <i className="bi bi-bell" style={{ fontSize: '18px' }} />
          <span className="notification-dot" />
        </button>

        {/* Refresh */}
        <button className="header-icon-btn">
          <i className="bi bi-arrow-clockwise" style={{ fontSize: '18px' }} />
        </button>

        {/* Admin Avatar */}
        <div className="user-avatar-sm ms-2" style={{ cursor: 'pointer' }}>A</div>
      </div>
    </header>
  )
}

export default Header
