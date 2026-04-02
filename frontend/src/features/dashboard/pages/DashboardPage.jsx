import { useNavigate } from 'react-router-dom'

const TEAL = '#009cad'

const stats = [
  { label: 'Total Customers', value: '1,234', icon: 'bi-people-fill' },
  { label: 'Documents', value: '567', icon: 'bi-file-earmark-text-fill' },
  { label: 'Publications', value: '89', icon: 'bi-collection-fill' },
  { label: 'Active Devices', value: '2,456', icon: 'bi-laptop-fill' },
  { label: 'Suspended', value: '23', icon: 'bi-person-x-fill' },
]

const recentUsers = [
  { name: 'أحمد علي', email: 'ahmed@email.com', status: 'registered', date: '2026-03-09' },
  { name: 'سارة أحمد', email: 'sara@email.com', status: 'registered', date: '2026-03-08' },
  { name: 'محمد علي', email: 'mo@email.com', status: 'suspended', date: '2026-03-07' },
  { name: 'فاطمة سعيد', email: 'fat@email.com', status: 'registered', date: '2026-03-06' },
]

const recentDocs = [
  { title: 'دورة React الكاملة', status: 'valid', date: '2026-03-09' },
  { title: 'احتراف Laravel', status: 'valid', date: '2026-03-08' },
  { title: 'JavaScript المتقدم', status: 'valid', date: '2026-03-07' },
  { title: 'دليل قواعد البيانات', status: 'suspended', date: '2026-03-06' },
]

const statusColor = { registered: '#4caf50', suspended: '#ff9800', expired: '#f44336', valid: '#4caf50' }

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* === Header === */}
      <div style={{
        background: TEAL, color: '#fff', padding: '10px 16px',
        fontWeight: 700, fontSize: 15, borderRadius: '4px 4px 0 0'
      }}>
        Dashboard
      </div>

      <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: 'none', padding: 20 }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              flex: '1 1 140px', border: '1px solid #ddd', borderRadius: 3,
              padding: '14px 16px', background: '#fafafa', textAlign: 'center'
            }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: 22, color: TEAL, display: 'block', marginBottom: 6 }} />
              <div style={{ fontSize: 22, fontWeight: 800, color: '#333' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* Recent Customers */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{
              background: TEAL, color: '#fff', padding: '8px 14px',
              fontWeight: 700, fontSize: 13, borderRadius: '3px 3px 0 0',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span>Recent Customers</span>
              <a href="#" onClick={e => { e.preventDefault(); navigate('/users') }}
                style={{ color: '#fff', fontSize: 12, textDecoration: 'underline' }}>View All</a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #ccc' }}>
              <thead><tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
                <th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Status</th><th style={thStyle}>Date</th>
              </tr></thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.email} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: statusColor[u.status], marginLeft: 4 }} />
                      <span style={{ color: statusColor[u.status], fontWeight: 600 }}>{u.status}</span>
                    </td>
                    <td style={tdStyle}>{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Documents */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{
              background: TEAL, color: '#fff', padding: '8px 14px',
              fontWeight: 700, fontSize: 13, borderRadius: '3px 3px 0 0',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span>Recent Documents</span>
              <a href="#" onClick={e => { e.preventDefault(); navigate('/documents') }}
                style={{ color: '#fff', fontSize: 12, textDecoration: 'underline' }}>View All</a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #ccc' }}>
              <thead><tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
                <th style={thStyle}>Document</th><th style={thStyle}>Status</th><th style={thStyle}>Date</th>
              </tr></thead>
              <tbody>
                {recentDocs.map((d, i) => (
                  <tr key={d.title} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: TEAL }}>{d.title}</td>
                    <td style={tdStyle}><span style={{ color: statusColor[d.status], fontWeight: 600 }}>{d.status}</span></td>
                    <td style={tdStyle}>{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 20 }}>
          <div style={{ background: TEAL, color: '#fff', padding: '8px 14px', fontWeight: 700, fontSize: 13, borderRadius: '3px 3px 0 0' }}>
            Quick Actions
          </div>
          <div style={{ border: '1px solid #ccc', borderTop: 'none', padding: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Add Customer', icon: 'bi-person-plus-fill', to: '/users/create' },
              { label: 'Add Publication', icon: 'bi-plus-circle-fill', to: '/publications/create' },
              { label: 'Access Control', icon: 'bi-shield-fill-check', to: '/access' },
              { label: 'Reports', icon: 'bi-graph-up-arrow', to: '/reports' },
              { label: 'Settings', icon: 'bi-gear-fill', to: '/settings' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.to)}
                style={{
                  background: TEAL, color: '#fff', border: 'none', borderRadius: 3,
                  padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                <i className={`bi ${a.icon}`} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#333', whiteSpace: 'nowrap' }
const tdStyle = { padding: '8px 12px', textAlign: 'right', fontSize: 13, verticalAlign: 'middle' }

export default DashboardPage
