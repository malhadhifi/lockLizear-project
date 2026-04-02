/**
 * ملف: DocumentsListPage.jsx
 * الوظيفة: لوحة إدارة المستندات (Manage Documents)
 * النسخة: حقيقية تجلب من الباك إند + أسماء حقول صحيحة
 */

import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  fetchDocuments,
  executeDocumentAction,
  setFilters,
} from '../store/documentsSlice'

const TEAL = '#009cad'

const borderColor = {
  valid:     '#4caf50',
  suspended: '#ff9800',
  expired:   '#f44336',
}

const DocumentsListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ✅ من Redux الحقيقي (مش Mock)
  const { list: documents, loading, error, pagination } = useSelector(s => s.documents)

  // حالات الفلاتر
  const [filter,      setFilter]      = useState('')
  const [sortBy,      setSortBy]      = useState('title')
  const [showAtLeast, setShowAtLeast] = useState(25)
  const [showFilter,  setShowFilter]  = useState('all')
  const [selected,    setSelected]    = useState([])
  const [bulkAction,  setBulkAction]  = useState('')
  const [activeSideNav, setActiveSideNav] = useState('manage')

  // ✅ جلب البيانات عند التحميل وعند تغيّر الفلاتر
  useEffect(() => {
    const params = {
      show:    showFilter !== 'all' ? showFilter : undefined,
      sort_by: sortBy,
      per_page: showAtLeast,
    }
    dispatch(setFilters(params))
    dispatch(fetchDocuments(params))
  }, [showFilter, sortBy, showAtLeast, dispatch])

  // ✅ فلترة نصية محلية فقط (title)
  const filtered = useMemo(() => {
    if (!filter) return documents
    const s = filter.toLowerCase()
    // ✅ اسم الحقل الحقيقي: title ليس name
    return documents.filter(d => d.title?.toLowerCase().includes(s))
  }, [documents, filter])

  // دوال التحديد
  const toggleSelect   = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const checkAll       = () => setSelected(filtered.map(d => d.id))
  const uncheckAll     = () => setSelected([])
  const invertSelection= () => setSelected(filtered.map(d => d.id).filter(id => !selected.includes(id)))

  // ✅ العمليات الجماعية عبر الباك إند
  const handleBulkAction = async () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'Delete') {
      if (!window.confirm(`هل أنت متأكد من حذف ${selected.length} مستند؟`)) return
    }
    try {
      await dispatch(executeDocumentAction({ ids: selected, action: bulkAction })).unwrap()
      toast.success(`تم تنفيذ ${bulkAction} على ${selected.length} مستند`)
    } catch (e) {
      toast.error(e || 'حدث خطأ')
    }
    setSelected([])
    setBulkAction('')
  }

  const sideNavItems = [
    { id: 'manage', label: 'إدارة (Manage)',       icon: 'bi-file-earmark-text-fill', action: () => setActiveSideNav('manage') },
    { id: 'export', label: 'تصدير (Export CSV)', icon: 'bi-box-arrow-up',            action: () => toast('تصدير السجلات') },
  ]

  // === Render ===
  return (
    <div style={{ display: 'flex', gap: 20 }}>

      {/* القائمة الجانبية */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {sideNavItems.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button type="button" onClick={item.action}
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

      {/* المحتوى الرئيسي */}
      <div style={{ flex: 1 }}>

        {/* ترويسة Teal */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', justifyContent: 'space-between', borderRadius: '2px 2px 0 0'
        }}>
          <span>إدارة المستندات المحمية (Manage Documents)</span>
          <span><i className="bi bi-file-earmark-lock-fill" /></span>
        </div>

        {/* صندوق الفلاتر */}
        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>

          {/* شريط البحث */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
            <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية (Filter)</label>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
              <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
                style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
            </div>
          </div>

          {/* قوائم الفرز والحالة */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>فرز حسب (Sort by)</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={filterSelectStyle}>
                {/* ✅ title هو اسم الحقل الحقيقي من الباك إند */}
                <option value="title">الاسم (Name)</option>
                <option value="id">المعرف (ID)</option>
                <option value="published">تاريخ النشر (Published Date)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>عرض على الأقل (Show at least)</label>
              <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={filterSelectStyle}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>عرض (Show)</label>
              <select value={showFilter} onChange={e => setShowFilter(e.target.value)} style={filterSelectStyle}>
                <option value="all">الكل (All)</option>
                <option value="valid">صالح (Valid)</option>
                <option value="suspended">موقوف (Suspended)</option>
                <option value="expired">منتهي (Expired)</option>
              </select>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

          {/* تحديد شامل */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>الكل (All)</span>
            <a href="#" onClick={e => { e.preventDefault(); checkAll() }}        style={{ color: TEAL }}>تحديد (Check)</a>     <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }}      style={{ color: TEAL }}>إلغاء التحديد (Uncheck)</a> <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس التحديد (Invert)</a>
          </div>

          {/* عمليات جماعية */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, fontSize: 13 }}>
            <label style={{ fontWeight: 600 }}>مع كل المحدد (With all checked)</label>
            <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
              style={{ ...filterSelectStyle, minWidth: 200, flex: 1, maxWidth: 300 }}>
              <option value=""></option>
              <option value="Suspend">إيقاف (Suspend)</option>
              <option value="Activate">تفعيل (Activate)</option>
              <option value="Delete">حذف (Delete)</option>
            </select>
            <button type="button" onClick={handleBulkAction}
              disabled={!bulkAction || selected.length === 0 || loading}
              style={{
                background: TEAL, color: '#fff', border: 'none', borderRadius: 2,
                padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                opacity: (!bulkAction || selected.length === 0 || loading) ? 0.5 : 1
              }}>
              {loading ? 'جاري...' : 'موافق (OK)'}
            </button>
          </div>
        </div>

        {/* ✅ مؤشر التحميل */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: TEAL, fontSize: 14, fontWeight: 600 }}>
            <i className="bi bi-arrow-repeat" style={{ marginLeft: 8, animation: 'spin 1s linear infinite' }} />
            جاري تحميل المستندات...
          </div>
        )}

        {/* ✅ رسالة الخطأ + زر إعادة المحاولة */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: '#f44336', marginBottom: 12, fontSize: 14 }}>⚠️ {error}</p>
            <button onClick={() => dispatch(fetchDocuments({}))} style={{
              background: TEAL, color: '#fff', border: 'none', borderRadius: 3,
              padding: '8px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 13
            }}>
              إعادة المحاولة (Retry)
            </button>
          </div>
        )}

        {/* عداد النتائج */}
        {!loading && !error && (
          <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }} dir="ltr">
            {'>> '}<span>[{filtered.length}]</span>{' <<'}
          </div>
        )}

        {/* بطاقات المستندات */}
        {!loading && !error && (
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                لا توجد مستندات مطابقة (No documents found)
              </div>
            ) : filtered.slice(0, showAtLeast).map(doc => (

              <div key={doc.id} style={{
                display: 'flex', alignItems: 'stretch',
                background: '#f8f8f8', marginBottom: 16,
                borderRight: `8px solid ${borderColor[doc.status] || '#ccc'}`,
                borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
              }}>

                {/* Checkbox */}
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} />
                </div>

                {/* بيانات المستند */}
                <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>

                  {/* ✅ doc.title ليس doc.name */}
                  <div style={{ marginBottom: 8 }}>
                    <a href="#" onClick={e => { e.preventDefault(); navigate(`/documents/${doc.id}`) }}
                      style={{ color: TEAL, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                      {doc.title}
                    </a>
                  </div>

                  <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <tbody>
                      <tr>
                        <td style={fieldLabelStyle}>المعرف (ID)</td>
                        <td style={fieldValueStyle}>{doc.id}</td>
                      </tr>
                      <tr>
                        {/* ✅ doc.published ليس doc.publishedDate */}
                        <td style={fieldLabelStyle}>تاريخ النشر (Published)</td>
                        <td style={fieldValueStyle}>{doc.published}</td>
                      </tr>
                      <tr>
                        <td style={fieldLabelStyle}>الحالة (Status)</td>
                        <td style={fieldValueStyle}>
                          {doc.status === 'valid'     && <span style={{ color: '#4caf50', fontWeight: 600 }}>صالح (Valid)</span>}
                          {doc.status === 'suspended' && <span style={{ color: '#ff9800', fontWeight: 600 }}>موقوف (Suspended)</span>}
                          {doc.status === 'expired'   && <span style={{ color: '#f44336', fontWeight: 600 }}>منتهي (Expired)</span>}
                        </td>
                      </tr>
                      <tr>
                        {/* ✅ doc.customers_count ليس doc.customersCount */}
                        <td style={fieldLabelStyle}>العملاء (Customers)</td>
                        <td style={fieldValueStyle}>
                          <a href="#" onClick={e => { e.preventDefault(); navigate(`/documents/${doc.id}`, { state: { tab: 'access' } }) }}
                            style={{ color: TEAL, fontWeight: 'bold' }}>
                            {doc.customers_count}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* أزرار الإجراءات السريعة */}
                <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                  <ActionIcon icon="bi-slash-circle" color="#ff9800" title="إيقاف (Suspend)"
                    onClick={() => {
                      dispatch(executeDocumentAction({ ids: [doc.id], action: 'Suspend' }))
                        .then(() => toast.success('تم إيقاف المستند'))
                    }} />
                  <ActionIcon icon="bi-x" color="#f44336" title="حذف (Delete)" bold
                    onClick={() => {
                      if (!window.confirm('هل أنت متأكد؟')) return
                      dispatch(executeDocumentAction({ ids: [doc.id], action: 'Delete' }))
                        .then(() => toast.success('تم حذف المستند'))
                    }} />
                  <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="عرض التفاصيل (View Details)"
                    onClick={() => navigate(`/documents/${doc.id}`)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* باجيناشن إذا كان في الباك إند */}
        {pagination && (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 8 }}>
            صفحة {pagination.current_page} من {pagination.last_page} | إجمالي: {pagination.total} مستند
          </div>
        )}
      </div>
    </div>
  )
}

// مكون الأيقونة
const ActionIcon = ({ icon, color, bg = 'transparent', bold = false, title, onClick }) => (
  <button type="button" onClick={onClick} title={title}
    style={{
      background: bg, color, border: bg === 'transparent' ? `2px solid ${color}` : 'none',
      borderRadius: '50%', width: 24, height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, padding: 0,
      fontWeight: bold ? 900 : 'normal'
    }}>
    <i className={`bi ${icon}`} />
  </button>
)

const filterInputStyle  = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const filterSelectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const fieldLabelStyle   = { fontWeight: 700, paddingLeft: 16, verticalAlign: 'top', color: '#111', whiteSpace: 'nowrap' }
const fieldValueStyle   = { color: '#333', verticalAlign: 'top' }

export default DocumentsListPage
