import { NavLink, useNavigate } from 'react-router-dom'

const TEAL = '#009cad'

const navItems = [
  { to: '/users', icon: 'bi-people-fill', label: 'العملاء' },
  { to: '/usb', icon: 'bi-usb-drive-fill', label: 'أجهزة USB' },
  { to: '/publications', icon: 'bi-collection-fill', label: 'المنشورات' },
  { to: '/documents', icon: 'bi-file-earmark-text-fill', label: 'المستندات' },
  { to: '/statistics', icon: 'bi-bar-chart-fill', label: 'الإحصائيات' },
  { to: '/backups', icon: 'bi-hdd-fill', label: 'النسخ الاحتياطية' },
  { to: '/settings', icon: 'bi-gear-fill', label: 'الإعدادات' },
  { to: '/news', icon: 'bi-newspaper', label: 'الأخبار' },
  { to: '/my-account', icon: 'bi-person-badge-fill', label: 'حسابي' },
  { action: 'logout', icon: 'bi-box-arrow-right', label: 'تسجيل الخروج' },
  { action: 'help', icon: 'bi-question-circle-fill', label: 'مساعدة' },
]

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('drm_token')
    navigate('/login')
  }

  return (
    <header style={{ width: '100%', marginBottom: 20 }}>
      {/* Top Blue Bar */}
      <div style={{
        background: '#0a80b0', /* Slightly darker blue from screenshot */
        color: '#fff',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Locklizard</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          Safeguard Enterprise لحماية PDF
        </div>
      </div>

      {/* Info Bar */}
      <div style={{
        padding: '6px 20px',
        borderBottom: '1px solid #ddd',
        fontSize: 12,
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>
          مسجل الدخول باسم: <span style={{ color: TEAL }}>A.Fletcher (A.fletcher@locklizard.int)</span>
        </span>
        <span dir="ltr">
          Server Time (UTC): 14:46 - Jun 17, 2016
        </span>
      </div>

      {/* Navigation Menu */}
      <div style={{ borderBottom: '2px solid #0a80b0', display: 'flex' }}>
        {navItems.map((item, i) => {
          const isButton = item.action
          const content = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: 14 }} />
              {item.label}
            </div>
          )

          const style = (isActive) => ({
            padding: '10px 16px',
            fontSize: 13,
            color: isActive ? '#fff' : TEAL,
            background: isActive ? TEAL : 'transparent',
            textDecoration: 'none',
            borderLeft: '1px solid #eee',
            cursor: 'pointer',
            display: 'block'
          })

          if (isButton) {
            return (
              <a key={item.label} href="#" style={style(false)}
                onClick={item.action === 'logout' ? handleLogout : e => e.preventDefault()}>
                {content}
              </a>
            )
          }

          return (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => style(isActive)}>
              {content}
            </NavLink>
          )
        })}
      </div>
    </header>
  )
}

export default Header
