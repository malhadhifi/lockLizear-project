import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
    {
        section: 'الرئيسية',
        items: [
            { to: '/dashboard', icon: 'bi-grid-fill', label: 'لوحة التحكم' },
        ]
    },
    {
        section: 'المحتوى',
        items: [
            { to: '/users', icon: 'bi-people-fill', label: 'المستخدمون', badge: '1,234' },
            { to: '/documents', icon: 'bi-play-circle-fill', label: 'المستندات', badge: '567' },
            { to: '/publications', icon: 'bi-collection-fill', label: 'المنشورات', badge: '89' },
        ]
    },
    {
        section: 'الوصول',
        items: [
            { to: '/access', icon: 'bi-shield-lock-fill', label: 'التحكم بالوصول' },
            { to: '/emails', icon: 'bi-envelope-fill', label: 'البريد الإلكتروني' },
        ]
    },
    {
        section: 'الإدارة',
        items: [
            { to: '/sub-admins', icon: 'bi-person-badge-fill', label: 'المشرفون الفرعيون' },
            { to: '/reports', icon: 'bi-bar-chart-fill', label: 'التقارير' },
            { to: '/settings', icon: 'bi-gear-fill', label: 'الإعدادات' },
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
            {/* العلامة التجارية */}
            <div className="sidebar-brand">
                <div className="brand-icon">🔐</div>
                <div>
                    <div className="brand-name">لوحة تحكم DRM</div>
                    <div className="brand-sub">نظام حماية المحتوى</div>
                </div>
            </div>

            {/* التنقل */}
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

            {/* المستخدم */}
            <div className="sidebar-footer">
                <div className="sidebar-user" onClick={handleLogout}
                    title="اضغط لتسجيل الخروج">
                    <div className="user-avatar">A</div>
                    <div>
                        <div className="user-name">المدير العام</div>
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
