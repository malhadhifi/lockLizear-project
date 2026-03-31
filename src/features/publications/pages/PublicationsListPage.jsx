import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deletePublication, deleteMultiplePublications } from '../store/publicationsSlice'
import toast from 'react-hot-toast'

const TEAL = '#009cad'

const PublicationsListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const publications = useSelector(state => state.publications.list)

  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showAtLeast, setShowAtLeast] = useState(25)
  const [showFilter, setShowFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [activeSideNav, setActiveSideNav] = useState('manage')

  const filtered = useMemo(() => {
    let result = [...publications]
    if (filter) {
      const s = filter.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
    }
    if (showFilter === 'obey') result = result.filter(p => p.obeyStartDate)
    else if (showFilter === 'no-obey') result = result.filter(p => !p.obeyStartDate)

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'id') return a.id - b.id
      return 0
    })
    return result
  }, [publications, filter, sortBy, showFilter])

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const checkAll = () => setSelected(filtered.map(p => p.id))
  const uncheckAll = () => setSelected([])
  const invertSelection = () => setSelected(filtered.map(p => p.id).filter(id => !selected.includes(id)))

  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'Delete') {
      if (!window.confirm(`هل أنت متأكد من حذف ${selected.length} منشور؟`)) return
      dispatch(deleteMultiplePublications(selected))
      toast.success(`تم حذف ${selected.length} منشور`)
    }
    setSelected([])
    setBulkAction('')
  }

  const handleDelete = (id) => {
    if (!window.confirm('هل تريد حذف هذا المنشور؟')) return
    dispatch(deletePublication(id))
    toast.success('تم حذف المنشور')
  }

  const sideNavItems = [
    { id: 'add', label: 'إضافة', icon: 'bi-plus-circle-fill', action: () => navigate('/publications/create') },
    { id: 'manage', label: 'إدارة', icon: 'bi-collection-fill', action: () => setActiveSideNav('manage') }
  ]

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* === القائمة الجانبية الداخلية للقسم === */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {sideNavItems.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button onClick={item.action}
                style={{
                  width: '100%', textAlign: 'right', padding: '12px 16px',
                  background: activeSideNav === item.id ? TEAL : '#fafafa',
                  color: activeSideNav === item.id ? '#fff' : TEAL,
                  border: '1px solid #ddd', borderBottom: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
                }}>
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            </li>
          ))}
          <li style={{ borderTop: '1px solid #ddd' }}></li>
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', borderRadius: '2px 2px 0 0'
        }}>
          <span>إدارة المنشورات (Manage Publications)</span>
          <span><i className="bi bi-collection-fill" /></span>
        </div>

        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية</label>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
                <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
                <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
                  style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>فرز حسب</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={filterSelectStyle}>
                  <option value="name">الاسم</option>
                  <option value="id">المعرف</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض على الأقل</label>
                <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={filterSelectStyle}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض</label>
                <select value={showFilter} onChange={e => setShowFilter(e.target.value)} style={filterSelectStyle}>
                  <option value="all">الكل</option>
                  <option value="obey">الالتزام بتاريخ البدء</option>
                  <option value="no-obey">عدم الالتزام بتاريخ البدء</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>الكل</span>
              <a href="#" onClick={e => { e.preventDefault(); checkAll() }} style={{ color: TEAL }}>تحديد</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }} style={{ color: TEAL }}>إلغاء التحديد</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس التحديد</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, fontSize: 13 }}>
              <label style={{ fontWeight: 600 }}>مع كل المحدد</label>
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} style={{ ...filterSelectStyle, minWidth: 200, flex: 1, maxWidth: 300 }}>
                <option value=""></option>
                <option value="Delete">حذف</option>
              </select>
              <button onClick={handleBulkAction}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                موافق
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }}>
          {'>> '} <span style={{ color: TEAL }}>[ {filtered.length} ]</span> {' <<'}
        </div>

        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>لا توجد منشورات</div>
          ) : filtered.slice(0, showAtLeast).map((pub) => (
            <div key={pub.id} style={{
              display: 'flex', alignItems: 'stretch',
              background: '#f8f8f8', marginBottom: 16,
              borderRight: `8px solid ${pub.obeyStartDate ? '#4caf50' : '#2196f3'}`,
              borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
            }}>
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={selected.includes(pub.id)} onChange={() => toggleSelect(pub.id)} />
              </div>

              <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
                <div style={{ marginBottom: 8 }}>
                  <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`) }}
                    style={{ color: TEAL, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    {pub.name}
                  </a>
                </div>
                <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <tbody>
                    <tr>
                      <td style={fieldLabelStyle}>الوصف:</td>
                      <td style={fieldValueStyle}>{pub.description || '—'}</td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>المعرف:</td>
                      <td style={fieldValueStyle}>{pub.id}</td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>الالتزام بتاريخ البدء:</td>
                      <td style={fieldValueStyle}>
                        <span style={{ color: pub.obeyStartDate ? '#4caf50' : '#999' }}>
                          {pub.obeyStartDate ? 'نعم' : 'لا'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>العملاء:</td>
                      <td style={fieldValueStyle}>
                        <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`, { state: { tab: 'customers' } }) }}
                          style={{ color: TEAL }}>{pub.customersCount}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>المستندات:</td>
                      <td style={fieldValueStyle}>
                        <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`, { state: { tab: 'documents' } }) }}
                          style={{ color: TEAL }}>{pub.docsCount}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                <ActionIcon icon="bi-pencil-fill" color={TEAL} title="تعديل"
                  onClick={() => navigate(`/publications/${pub.id}/edit`)} />
                <ActionIcon icon="bi-x" color="#f44336" title="حذف" bold={true}
                  onClick={() => handleDelete(pub.id)} />
                <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="المزيد" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ActionIcon = ({ icon, color, bg = 'transparent', bold = false, title, onClick }) => (
  <button onClick={onClick} title={title}
    style={{
      background: bg, color: color, border: bg === 'transparent' ? `2px solid ${color}` : 'none',
      borderRadius: '50%', width: 24, height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, padding: 0,
      fontWeight: bold ? 900 : 'normal'
    }}>
    <i className={`bi ${icon}`} />
  </button>
)

const filterInputStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const filterSelectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const fieldLabelStyle = { fontWeight: 700, paddingLeft: 16, verticalAlign: 'top', color: '#111', whiteSpace: 'nowrap' }
const fieldValueStyle = { color: '#333', verticalAlign: 'top' }

export default PublicationsListPage
