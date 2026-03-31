import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../store/accessSlice'
import toast from 'react-hot-toast'

const TEAL = '#009cad'

const MOCK_USERS = [
  { id: 1, name: 'أحمد علي', email: 'ahmed@email.com', status: 'registered' },
  { id: 2, name: 'سارة أحمد', email: 'sara@email.com', status: 'registered' },
  { id: 3, name: 'محمد علي', email: 'mo@email.com', status: 'suspended' },
  { id: 4, name: 'فاطمة سعيد', email: 'fat@email.com', status: 'registered' },
  { id: 5, name: 'عمر حسن', email: 'omar@email.com', status: 'expired' },
]

const MOCK_DOCS = [
  { id: 1, title: 'دورة React الكاملة', granted: true, expiry: '2026-12-31' },
  { id: 2, title: 'احتراف Laravel', granted: true, expiry: '2026-12-31' },
  { id: 3, title: 'JavaScript المتقدم', granted: false, expiry: '' },
  { id: 4, title: 'دليل قواعد البيانات', granted: true, expiry: '2026-09-30' },
  { id: 5, title: 'Python للمبتدئين', granted: false, expiry: '' },
]

const MOCK_PUBS = [
  { id: 1, title: 'مطور Full Stack 2026', docs: 30, granted: true, expiry: '2026-12-31' },
  { id: 2, title: 'Python للمبتدئين', docs: 20, granted: false, expiry: '' },
  { id: 3, title: 'تصميم واجهات المستخدم', docs: 15, granted: true, expiry: '2026-12-31' },
]

const statusColor = { registered: '#4caf50', suspended: '#ff9800', expired: '#f44336' }

const AccessControlPage = () => {
  const dispatch = useDispatch()
  const { selectedUserId } = useSelector(state => state.access)
  const [activeTab, setActiveTab] = useState('documents')
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [pubs, setPubs] = useState(MOCK_PUBS)
  const [userFilter, setUserFilter] = useState('')

  const users = MOCK_USERS
  const selectedUser = users.find(u => u.id === selectedUserId)
  const filteredUsers = users.filter(u => !userFilter || u.name.includes(userFilter) || u.email.includes(userFilter))

  return (
    <div>
      <div style={{ background: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 15, borderRadius: '4px 4px 0 0' }}>
        Access Control
      </div>

      <div style={{ display: 'flex', border: '1px solid #ccc', borderTop: 'none', minHeight: 500 }}>
        {/* User list */}
        <div style={{ width: 240, borderLeft: '1px solid #ccc', background: '#fafafa', flexShrink: 0 }}>
          <div style={{ background: TEAL, color: '#fff', padding: '8px 12px', fontWeight: 700, fontSize: 12 }}>
            Select Customer
          </div>
          <div style={{ padding: 8 }}>
            <input type="text" value={userFilter} onChange={e => setUserFilter(e.target.value)} placeholder="Filter..."
              style={{ width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 12, marginBottom: 6 }} />
          </div>
          <div style={{ overflow: 'auto', maxHeight: 400 }}>
            {filteredUsers.map(u => (
              <div key={u.id} onClick={() => dispatch(setSelectedUser(u))}
                style={{
                  padding: '8px 12px', cursor: 'pointer', fontSize: 12,
                  background: selectedUserId === u.id ? '#e0f7fa' : 'transparent',
                  borderBottom: '1px solid #eee',
                  borderRight: selectedUserId === u.id ? `3px solid ${TEAL}` : '3px solid transparent',
                }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: statusColor[u.status] }} />
                  {u.name}
                </div>
                <div style={{ color: '#888', fontSize: 11 }}>{u.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, background: '#fff' }}>
          {!selectedUser ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
              <i className="bi bi-shield-lock" style={{ fontSize: 50, display: 'block', marginBottom: 12 }} />
              <p>Select a customer to manage access</p>
            </div>
          ) : (
            <>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #ccc', background: '#f5f5f5' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: statusColor[selectedUser.status], marginLeft: 6 }} />
                  {selectedUser.name}
                </div>
                <div style={{ color: '#666', fontSize: 12 }}>{selectedUser.email}</div>
              </div>

              <div style={{ display: 'flex', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                {[{ key: 'documents', label: 'Document Access' }, { key: 'publications', label: 'Publication Access' }].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 16px', fontSize: 13, fontWeight: 600,
                      background: activeTab === tab.key ? '#fff' : '#e5e5e5',
                      border: 'none', borderBottom: activeTab === tab.key ? `2px solid ${TEAL}` : '2px solid transparent',
                      color: activeTab === tab.key ? TEAL : '#666', cursor: 'pointer'
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'documents' && (
                <div>
                  <div style={{ background: TEAL, color: '#fff', padding: '8px 14px', fontWeight: 700, fontSize: 13 }}>
                    Document Access for {selectedUser.name}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
                      <th style={thStyle}>Document</th><th style={thStyle}>Access</th><th style={thStyle}>Expiry</th><th style={thStyle}>Action</th>
                    </tr></thead>
                    <tbody>
                      {docs.map((d, i) => (
                        <tr key={d.id} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{d.title}</td>
                          <td style={tdStyle}>
                            <span style={{ color: d.granted ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                              {d.granted ? 'Granted ✓' : 'Denied ✗'}
                            </span>
                          </td>
                          <td style={tdStyle}>{d.expiry || '—'}</td>
                          <td style={tdStyle}>
                            <button onClick={() => {
                              setDocs(ds => ds.map(x => x.id === d.id ? { ...x, granted: !x.granted } : x))
                              toast.success(d.granted ? 'Revoked' : 'Granted')
                            }} style={{ background: d.granted ? '#f44336' : '#4caf50', color: '#fff', border: 'none', borderRadius: 3, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
                              {d.granted ? 'Revoke' : 'Grant'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'publications' && (
                <div>
                  <div style={{ background: TEAL, color: '#fff', padding: '8px 14px', fontWeight: 700, fontSize: 13 }}>
                    Publication Access for {selectedUser.name}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
                      <th style={thStyle}>Publication</th><th style={thStyle}>Docs</th><th style={thStyle}>Access</th><th style={thStyle}>Expiry</th><th style={thStyle}>Action</th>
                    </tr></thead>
                    <tbody>
                      {pubs.map((p, i) => (
                        <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{p.title}</td>
                          <td style={tdStyle}>{p.docs}</td>
                          <td style={tdStyle}>
                            <span style={{ color: p.granted ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                              {p.granted ? 'Granted ✓' : 'Denied ✗'}
                            </span>
                          </td>
                          <td style={tdStyle}>{p.expiry || '—'}</td>
                          <td style={tdStyle}>
                            <button onClick={() => {
                              setPubs(ps => ps.map(x => x.id === p.id ? { ...x, granted: !x.granted } : x))
                              toast.success(p.granted ? 'Revoked' : 'Granted')
                            }} style={{ background: p.granted ? '#f44336' : '#4caf50', color: '#fff', border: 'none', borderRadius: 3, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
                              {p.granted ? 'Revoke' : 'Grant'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ padding: '12px 16px', borderTop: '1px solid #ddd', background: '#f0f0f0' }}>
                <button onClick={() => toast.success('Changes saved!')}
                  style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '7px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  OK
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#333', whiteSpace: 'nowrap' }
const tdStyle = { padding: '8px 12px', textAlign: 'right', fontSize: 13, verticalAlign: 'middle' }

export default AccessControlPage
