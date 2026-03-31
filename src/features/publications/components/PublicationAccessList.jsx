import { useState } from 'react'
import toast from 'react-hot-toast'

const MOCK_CUSTOMERS = [
  { id: 1, name: 'أحمد علي', company: 'شركة التقنية', email: 'ahmed@email.com', status: 'registered', registered: '2026-01-10', expires: '' },
  { id: 2, name: 'سارة أحمد', company: 'مؤسسة النور', email: 'sara@email.com', status: 'registered', registered: '2026-02-01', expires: '2026-12-31' },
  { id: 3, name: 'محمد علي', company: 'شركة البرمجة', email: 'mo@email.com', status: 'suspended', registered: '2025-06-15', expires: '' },
  { id: 4, name: 'فاطمة سعيد', company: '', email: 'fat@email.com', status: 'registered', registered: '2025-11-20', expires: '' },
  { id: 5, name: 'عمر حسن', company: 'شركة الحلول', email: 'omar@email.com', status: 'expired', registered: '2024-05-01', expires: '2025-12-31' },
  { id: 6, name: 'ليلى عبدالله', company: '', email: 'layla@email.com', status: 'not_registered', registered: '', expires: '' },
]

const PublicationAccessList = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilter, setShowFilter] = useState('all')
  const [bulkAction, setBulkAction] = useState('')

  const filtered = customers.filter(c => {
    const s = filter.toLowerCase()
    const matchFilter = !s || c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.company.toLowerCase().includes(s)
    const matchStatus = showFilter === 'all' ||
      (showFilter === 'registered' && c.status === 'registered') ||
      (showFilter === 'suspended' && c.status === 'suspended') ||
      (showFilter === 'expired' && c.status === 'expired') ||
      (showFilter === 'not_registered' && c.status === 'not_registered')
    return matchFilter && matchStatus
  })

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id))

  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'revoke') {
      setCustomers(cs => cs.filter(c => !selected.includes(c.id)))
      toast.success(`تم إلغاء الوصول لـ ${selected.length} عميل`)
    } else if (bulkAction === 'grant_webviewer') {
      toast.success(`تم منح Web Viewer لـ ${selected.length} عميل`)
    } else if (bulkAction === 'revoke_webviewer') {
      toast.success(`تم إلغاء Web Viewer لـ ${selected.length} عميل`)
    }
    setSelected([])
    setBulkAction('')
  }

  const statusLabel = (status) => {
    const map = {
      registered: { color: '#2e7d32', bg: '#e8f5e9', text: 'مسجل' },
      suspended: { color: '#e65100', bg: '#fff3e0', text: 'موقوف' },
      expired: { color: '#c62828', bg: '#ffebee', text: 'منتهي' },
      not_registered: { color: '#1565c0', bg: '#e3f2fd', text: 'غير مسجل' },
    }
    const s = map[status] || map.not_registered
    return <span style={{ color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{s.text}</span>
  }

  return (
    <div>
      {/* شريط عنوان أزرق */}
      <div style={{ background: '#0078d4', color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: 13 }}>
        العملاء المصرح لهم (Customer Access) — {customers.length} عميل
      </div>

      {/* الفلاتر */}
      <div style={{
        padding: '10px 16px', background: '#f0f0f0', borderBottom: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13
      }}>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>فلتر:</label>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="بحث..."
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 8px', width: 160, fontSize: 13 }} />
        </div>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>عرض:</label>
          <select value={showFilter} onChange={e => setShowFilter(e.target.value)}
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
            <option value="all">الكل</option>
            <option value="registered">مسجل</option>
            <option value="suspended">موقوف</option>
            <option value="expired">منتهي</option>
            <option value="not_registered">غير مسجل</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>ترتيب:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
            <option value="name">الاسم</option>
            <option value="company">الشركة</option>
            <option value="email">البريد</option>
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
              <th style={thStyle}><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
              <th style={thStyle}>الاسم</th>
              <th style={thStyle}>الشركة</th>
              <th style={thStyle}>البريد الإلكتروني</th>
              <th style={thStyle}>الحالة</th>
              <th style={thStyle}>تاريخ التسجيل</th>
              <th style={thStyle}>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#888' }}>لا يوجد عملاء</td></tr>
            ) : filtered.map((c, idx) => (
              <tr key={c.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginLeft: 6,
                    background: c.status === 'registered' ? '#2e7d32' : c.status === 'suspended' ? '#e65100' : c.status === 'expired' ? '#c62828' : '#1565c0'
                  }} />
                  {c.name}
                </td>
                <td style={tdStyle}>{c.company || '—'}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{statusLabel(c.status)}</td>
                <td style={tdStyle}>{c.registered || '—'}</td>
                <td style={tdStyle}>{c.expires || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* إجراءات جماعية */}
      <div style={{
        padding: '10px 16px', background: '#f0f0f0', borderTop: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
      }}>
        <label style={{ fontWeight: 600 }}>مع كل المحدد:</label>
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
          <option value="">-- اختر --</option>
          <option value="revoke">إلغاء الوصول</option>
          <option value="grant_webviewer">منح Web Viewer</option>
          <option value="revoke_webviewer">إلغاء Web Viewer</option>
        </select>
        <button onClick={handleBulkAction} disabled={!bulkAction || !selected.length}
          style={{
            background: '#0078d4', color: '#fff', border: 'none', borderRadius: 3,
            padding: '4px 12px', fontSize: 13, cursor: 'pointer',
            opacity: (!bulkAction || !selected.length) ? 0.5 : 1
          }}>
          تنفيذ
        </button>
        {selected.length > 0 && <span style={{ color: '#555' }}>({selected.length} محدد)</span>}
      </div>
    </div>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#333', whiteSpace: 'nowrap' }
const tdStyle = { padding: '8px 12px', textAlign: 'right', fontSize: 13, verticalAlign: 'middle' }

export default PublicationAccessList
