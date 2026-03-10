import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
    {
        section: 'MAIN',
        items: [
            { to: '/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
        ]
    },
    {
        section: 'CONTENT',
        items: [
            { to: '/users', icon: 'bi-people-fill', label: 'Users', badge: '1,234' },
            { to: '/documents', icon: 'bi-play-circle-fill', label: 'Documents', badge: '567' },
            { to: '/publications', icon: 'bi-collection-fill', label: 'Publications', badge: '89' },
        ]
    },
    {
        section: 'ACCESS',
        items: [
            { to: '/access', icon: 'bi-shield-lock-fill', label: 'Access Control' },
            { to: '/emails', icon: 'bi-envelope-fill', label: 'Emails' },
        ]
    },
    {
        section: 'ADMIN',
        items: [
            { to: '/sub-admins', icon: 'bi-person-badge-fill', label: 'Sub Admins' },
            { to: '/reports', icon: 'bi-bar-chart-fill', label: 'Reports' },
            { to: '/settings', icon: 'bi-gear-fill', label: 'Settings' },
        ]
    }
]

const Sidebar = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('drm_token')
        navigate('/login')
    }

    return (
        <aside className="drm-sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-icon">🔐</div>
                <div>
                    <div className="brand-name">DRM Admin</div>
                    <div className="brand-sub">Content Protection</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((section) => (
                    <div key={section.section}>
                        <div className="nav-section-label">{section.section}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `nav-link${isActive ? ' active' : ''}`
                                }
                            >
                                <i className={`bi ${item.icon}`} />
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge && (
                                    <span className="badge rounded-pill"
                                        style={{ background: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer User */}
            <div className="sidebar-footer">
                <div className="sidebar-user" onClick={handleLogout}
                    title="Click to Logout">
                    <div className="user-avatar">A</div>
                    <div>
                        <div className="user-name">Super Admin</div>
                        <div className="user-role">admin@drm.com</div>
                    </div>
                    <i className="bi bi-box-arrow-right ms-auto"
                        style={{ color: '#5a5f7e', fontSize: '16px' }} />
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
