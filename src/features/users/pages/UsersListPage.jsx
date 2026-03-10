import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MOCK_USERS = [
  { id:1, name:'Ahmed Ali',    email:'ahmed@email.com',  status:'active',    devices:2, maxDevices:3, expiry:'2026-12-31', created:'2025-12-01' },
  { id:2, name:'Sara Ahmed',   email:'sara@email.com',   status:'active',    devices:1, maxDevices:2, expiry:'2026-12-31', created:'2025-12-05' },
  { id:3, name:'Mohamed Ali',  email:'mo@email.com',     status:'suspended', devices:3, maxDevices:3, expiry:'2026-06-30', created:'2025-11-20' },
  { id:4, name:'Fatima Said',  email:'fat@email.com',    status:'active',    devices:1, maxDevices:3, expiry:'2026-12-31', created:'2026-01-10' },
  { id:5, name:'Omar Hassan',  email:'omar@email.com',   status:'expired',   devices:0, maxDevices:2, expiry:'2025-12-31', created:'2025-10-15' },
  { id:6, name:'Layla Nasser', email:'layla@email.com',  status:'active',    devices:2, maxDevices:3, expiry:'2026-12-31', created:'2026-01-20' },
  { id:7, name:'Khalid Said',  email:'khal@email.com',   status:'active',    devices:1, maxDevices:2, expiry:'2026-09-30', created:'2026-02-01' },
  { id:8, name:'Nour Ahmed',   email:'nour@email.com',   status:'suspended', devices:0, maxDevices:3, expiry:'2026-12-31', created:'2026-02-15' },
]

const StatusBadge = ({ status }) => {
  const map = {
    active:    { cls:'badge-active',    icon:'bi-circle-fill', label:'Active' },
    suspended: { cls:'badge-suspended', icon:'bi-circle-fill', label:'Suspended' },
    expired:   { cls:'badge-expired',   icon:'bi-circle-fill', label:'Expired' },
  }
  const s = map[status] || map.expired
  return (
    <span className={`badge rounded-pill px-3 py-1 ${s.cls}`}>
      <i className={`bi ${s.icon} me-1`} style={{ fontSize:'7px' }} />
      {s.label}
    </span>
  )
}

const UsersListPage = () => {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('all')
  const [selected, setSelected]     = useState([])
  const [users, setUsers]           = useState(MOCK_USERS)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const toggleSelect = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id])

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(u=>u.id))

  const handleSuspend = (userId) => {
    setUsers(u => u.map(x => x.id===userId ? {...x, status:'suspended'} : x))
    toast.success('User suspended successfully')
  }

  const handleActivate = (userId) => {
    setUsers(u => u.map(x => x.id===userId ? {...x, status:'active'} : x))
    toast.success('User activated successfully')
  }

  const handleDelete = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setUsers(u => u.filter(x => x.id !== userId))
    toast.success('User deleted')
  }

  const handleBulkSuspend = () => {
    if (!selected.length) return
    setUsers(u => u.map(x => selected.includes(x.id) ? {...x, status:'suspended'} : x))
    toast.success(`${selected.length} users suspended`)
    setSelected([])
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Users Management</h4>
          <p className="text-muted mb-0" style={{ fontSize:'13px' }}>
            Manage all DRM system users and their access
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-drm">
            <i className="bi bi-upload me-2" />Import CSV
          </button>
          <button className="btn btn-outline-drm">
            <i className="bi bi-download me-2" />Export CSV
          </button>
          <button className="btn btn-primary-drm"
            onClick={() => navigate('/users/create')}>
            <i className="bi bi-plus-lg me-2" />Add User
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="row g-3 mb-4">
        {[
          { label:'Total',     value: users.length,                                              color:'#4361ee' },
          { label:'Active',    value: users.filter(u=>u.status==='active').length,    color:'#2dc653' },
          { label:'Suspended', value: users.filter(u=>u.status==='suspended').length, color:'#f4a261' },
          { label:'Expired',   value: users.filter(u=>u.status==='expired').length,   color:'#e63946' },
        ].map(s => (
          <div className="col-3" key={s.label}>
            <div className="drm-card p-3 text-center">
              <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#6b7280' }}>{s.label} Users</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="drm-card">
        {/* Filters */}
        <div className="card-header flex-wrap gap-3">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            {/* Search */}
            <div className="drm-search" style={{ width:'260px' }}>
              <i className="bi bi-search" />
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="form-select drm-input"
              style={{ width:'150px' }}
              value={statusFilter}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="d-flex gap-2 align-items-center ms-auto">
              <span style={{ fontSize:13, color:'#6b7280' }}>
                {selected.length} selected
              </span>
              <button className="btn btn-sm btn-outline-drm" onClick={handleBulkSuspend}>
                <i className="bi bi-pause-circle me-1" />Suspend Selected
              </button>
              <button className="btn btn-sm"
                style={{ background:'#fdecea', color:'#e63946', borderRadius:8 }}>
                <i className="bi bi-trash me-1" />Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table className="drm-table">
            <thead>
              <tr>
                <th style={{ width:40 }}>
                  <input type="checkbox" className="form-check-input"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>User</th>
                <th>Status</th>
                <th>Devices</th>
                <th>Expiry Date</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <i className="bi bi-people" />
                      <h5>No users found</h5>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <input type="checkbox" className="form-check-input"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-avatar-sm">{u.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{u.name}</div>
                        <div style={{ color:'#9ca3af', fontSize:12 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={u.status} /></td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <i className="bi bi-laptop text-muted" style={{ fontSize:13 }} />
                      <span style={{ fontWeight:600 }}>{u.devices}</span>
                      <span style={{ color:'#d1d5db' }}>/</span>
                      <span style={{ color:'#9ca3af', fontSize:12 }}>{u.maxDevices}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize:12,
                      color: new Date(u.expiry) < new Date() ? '#e63946' : '#6b7280'
                    }}>
                      {u.expiry}
                    </span>
                  </td>
                  <td style={{ color:'#6b7280', fontSize:12 }}>{u.created}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm"
                        style={{ background:'#e8f0ff', color:'#4361ee', borderRadius:8, padding:'4px 10px' }}
                        onClick={() => navigate(`/users/${u.id}`)}
                        title="View Details"
                      >
                        <i className="bi bi-eye" />
                      </button>
                      {u.status !== 'suspended' ? (
                        <button
                          className="btn btn-sm"
                          style={{ background:'#fff3e8', color:'#f4a261', borderRadius:8, padding:'4px 10px' }}
                          onClick={() => handleSuspend(u.id)}
                          title="Suspend"
                        >
                          <i className="bi bi-pause-circle" />
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm"
                          style={{ background:'#e6f9ed', color:'#2dc653', borderRadius:8, padding:'4px 10px' }}
                          onClick={() => handleActivate(u.id)}
                          title="Activate"
                        >
                          <i className="bi bi-check-circle" />
                        </button>
                      )}
                      <button
                        className="btn btn-sm"
                        style={{ background:'#fdecea', color:'#e63946', borderRadius:8, padding:'4px 10px' }}
                        onClick={() => handleDelete(u.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-body border-top d-flex align-items-center justify-content-between">
          <span style={{ fontSize:13, color:'#6b7280' }}>
            Showing {filtered.length} of {users.length} users
          </span>
          <nav>
            <ul className="pagination drm-pagination mb-0">
              <li className="page-item disabled"><a className="page-link">Previous</a></li>
              <li className="page-item active"><a className="page-link">1</a></li>
              <li className="page-item"><a className="page-link">2</a></li>
              <li className="page-item"><a className="page-link">3</a></li>
              <li className="page-item"><a className="page-link">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default UsersListPage
