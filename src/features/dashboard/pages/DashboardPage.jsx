import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock Data
const stats = [
  { label:'Total Users',       value:'1,234', change:'+12 this week', up:true,  icon:'bi-people-fill',      color:'blue'   },
  { label:'Documents',         value:'567',   change:'+34 this month', up:true,  icon:'bi-play-circle-fill', color:'green'  },
  { label:'Publications',      value:'89',    change:'+5 new',         up:true,  icon:'bi-collection-fill',  color:'orange' },
  { label:'Active Devices',    value:'2,456', change:'+67 today',      up:true,  icon:'bi-laptop-fill',      color:'purple' },
  { label:'Suspended Users',   value:'23',    change:'-2 this week',   up:false, icon:'bi-person-x-fill',    color:'red'    },
]

const recentUsers = [
  { name:'Ahmed Ali',   email:'ahmed@email.com',  status:'active',    date:'2026-03-09', devices:2 },
  { name:'Sara Ahmed',  email:'sara@email.com',   status:'active',    date:'2026-03-08', devices:1 },
  { name:'Mohamed Ali', email:'mo@email.com',     status:'suspended', date:'2026-03-07', devices:3 },
  { name:'Fatima Said', email:'fat@email.com',    status:'active',    date:'2026-03-06', devices:1 },
  { name:'Omar Hassan', email:'omar@email.com',   status:'expired',   date:'2026-03-05', devices:0 },
]

const recentDocs = [
  { title:'React Complete Course',    type:'video', views:1234, status:'active' },
  { title:'Laravel Mastery',          type:'video', views:987,  status:'active' },
  { title:'Advanced JavaScript',      type:'video', views:654,  status:'active' },
  { title:'Database Design Guide',    type:'pdf',   views:321,  status:'suspended' },
  { title:'Python for Beginners',     type:'video', views:876,  status:'active' },
]

const StatusBadge = ({ status }) => {
  const map = {
    active:    'badge-active',
    suspended: 'badge-suspended',
    expired:   'badge-expired',
  }
  return (
    <span className={`badge rounded-pill px-3 py-1 ${map[status] || 'badge-pending'}`}>
      <i className="bi bi-circle-fill me-1" style={{ fontSize: '7px' }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* Welcome Banner */}
      <div className="drm-card mb-4" style={{
        background: 'linear-gradient(135deg, #4361ee 0%, #7c3aed 100%)',
        border: 'none', color: '#fff'
      }}>
        <div className="card-body p-4 d-flex align-items-center justify-content-between">
          <div>
            <h4 className="fw-bold mb-1">Welcome back, Admin! 👋</h4>
            <p className="mb-0" style={{ opacity: 0.85, fontSize: '14px' }}>
              Here's what's happening with your DRM system today.
            </p>
          </div>
          <div style={{ fontSize: '64px', opacity: 0.3 }}>🔐</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-xl-2-4 col-lg-4 col-md-6" key={s.label}
            style={{ flex: '0 0 20%', maxWidth: '20%' }}>
            <div className="stats-card">
              <div className={`stats-icon ${s.color}`}>
                <i className={`bi ${s.icon}`} />
              </div>
              <div>
                <div className="stats-value">{s.value}</div>
                <div className="stats-label">{s.label}</div>
                <div className={`stats-change ${s.up ? 'up' : 'down'}`}>
                  <i className={`bi bi-arrow-${s.up ? 'up' : 'down'}-right`} />
                  {s.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        {/* User Status Pie */}
        <div className="col-lg-4">
          <div className="drm-card h-100">
            <div className="card-header">
              <h5><i className="bi bi-pie-chart-fill me-2 text-primary" />User Status</h5>
            </div>
            <div className="card-body text-center">
              <div style={{
                width: 160, height: 160,
                borderRadius: '50%',
                background: 'conic-gradient(#4361ee 0% 78%, #f4a261 78% 90%, #e63946 90% 100%)',
                margin: '0 auto 20px',
                boxShadow: '0 4px 20px rgba(67,97,238,0.2)'
              }} />
              <div className="d-flex flex-column gap-2">
                {[
                  { color:'#4361ee', label:'Active',    value:'965', pct:'78%' },
                  { color:'#f4a261', label:'Suspended', value:'146', pct:'12%' },
                  { color:'#e63946', label:'Expired',   value:'123', pct:'10%' },
                ].map(l => (
                  <div key={l.label} className="d-flex align-items-center justify-content-between px-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width:10, height:10, borderRadius:'50%', background:l.color }} />
                      <span style={{ fontSize:'13px', color:'#6b7280' }}>{l.label}</span>
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:700 }}>{l.value} ({l.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Document Types */}
        <div className="col-lg-4">
          <div className="drm-card h-100">
            <div className="card-header">
              <h5><i className="bi bi-pie-chart-fill me-2 text-success" />Document Types</h5>
            </div>
            <div className="card-body text-center">
              <div style={{
                width: 160, height: 160,
                borderRadius: '50%',
                background: 'conic-gradient(#2dc653 0% 70%, #4361ee 70% 100%)',
                margin: '0 auto 20px',
                boxShadow: '0 4px 20px rgba(45,198,83,0.2)'
              }} />
              <div className="d-flex flex-column gap-2">
                {[
                  { color:'#2dc653', label:'Videos', value:'397', pct:'70%' },
                  { color:'#4361ee', label:'PDFs',   value:'170', pct:'30%' },
                ].map(l => (
                  <div key={l.label} className="d-flex align-items-center justify-content-between px-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width:10, height:10, borderRadius:'50%', background:l.color }} />
                      <span style={{ fontSize:'13px', color:'#6b7280' }}>{l.label}</span>
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:700 }}>{l.value} ({l.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="drm-card h-100">
            <div className="card-header">
              <h5><i className="bi bi-lightning-fill me-2 text-warning" />Quick Actions</h5>
            </div>
            <div className="card-body">
              {[
                { label:'Add New User',       icon:'bi-person-plus-fill',  color:'#4361ee', to:'/users/create' },
                { label:'Upload Document',    icon:'bi-cloud-upload-fill', color:'#2dc653', to:'/documents' },
                { label:'Create Publication', icon:'bi-plus-circle-fill',  color:'#7c3aed', to:'/publications/create' },
                { label:'Manage Access',      icon:'bi-shield-plus-fill',  color:'#f4a261', to:'/access' },
                { label:'View Reports',       icon:'bi-graph-up-arrow',    color:'#e63946', to:'/reports' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.to)}
                  className="d-flex align-items-center gap-3 w-100 p-3 mb-2 rounded-3 border-0 text-start"
                  style={{ background:'#f8f9fa', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background='#eef2ff'}
                  onMouseOut={e  => e.currentTarget.style.background='#f8f9fa'}
                >
                  <div style={{
                    width:36, height:36, borderRadius:10, background:a.color+'22',
                    display:'flex', alignItems:'center', justifyContent:'center'
                  }}>
                    <i className={`bi ${a.icon}`} style={{ color:a.color, fontSize:16 }} />
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:600 }}>{a.label}</span>
                  <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize:12 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="row g-3">
        {/* Recent Users */}
        <div className="col-lg-7">
          <div className="drm-card">
            <div className="card-header">
              <h5><i className="bi bi-people-fill me-2 text-primary" />Recent Users</h5>
              <button className="btn btn-outline-drm btn-sm"
                onClick={() => navigate('/users')}>
                View All <i className="bi bi-arrow-right ms-1" />
              </button>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="drm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Devices</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.email}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-avatar-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13 }}>{u.name}</div>
                            <div style={{ color:'#9ca3af', fontSize:12 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><StatusBadge status={u.status} /></td>
                      <td>
                        <span style={{ fontWeight:600 }}>{u.devices}</span>
                        <span style={{ color:'#9ca3af', fontSize:12 }}> devices</span>
                      </td>
                      <td style={{ color:'#6b7280', fontSize:13 }}>{u.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Documents */}
        <div className="col-lg-5">
          <div className="drm-card">
            <div className="card-header">
              <h5><i className="bi bi-trophy-fill me-2 text-warning" />Top Documents</h5>
              <button className="btn btn-outline-drm btn-sm"
                onClick={() => navigate('/documents')}>
                View All <i className="bi bi-arrow-right ms-1" />
              </button>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="drm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map((d, i) => (
                    <tr key={d.title}>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: i < 3 ? 'var(--primary)' : '#9ca3af',
                          fontSize: 13
                        }}>#{i+1}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${d.type==='video'?'bi-play-circle-fill':'bi-file-pdf-fill'}`}
                            style={{ color: d.type==='video'?'#4361ee':'#e63946', fontSize:16 }} />
                          <span style={{ fontSize:13, fontWeight:500 }}>{d.title}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:700, fontSize:13 }}>{d.views.toLocaleString()}</td>
                      <td><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
