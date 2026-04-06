/**
 * ملف: DocumentsListPage.jsx
 * الوظيفة: لوحة إدارة المستندات
 * النمط: موحّد مع PublicationsListPage
 *
 * بنية البيانات بعد فك تغليف axios interceptor:
 *   useQuery data = { items: Document[], total, per_page, current_page, last_page }
 *
 * لذلك:
 *   documents  = data?.items   ← مباشرة بدون .data إضافية
 *   pagination = data
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDebounce } from '../../../hooks/useDebounce'
import {
  useDocuments,
  useDocumentAction,
  useDocumentExport,
} from '../hooks/useDocuments'

const TEAL = '#009cad'

const borderColor = {
  valid:     '#4caf50',
  suspended: '#ff9800',
  expired:   '#f44336',
}

const DocumentsListPage = () => {
  const navigate = useNavigate()

  const [searchInput,   setSearchInput]   = useState('')
  const [sortBy,        setSortBy]        = useState('title')
  const [perPage,       setPerPage]       = useState(25)
  const [showFilter,    setShowFilter]    = useState('all')
  const [page,          setPage]          = useState(1)
  const [selected,      setSelected]      = useState([])
  const [bulkAction,    setBulkAction]    = useState('')
  const [activeSideNav, setActiveSideNav] = useState('manage')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportType, setExportType] = useState('all')
  const [exportFormat, setExportFormat] = useState('csv')

  const debouncedSearch = useDebounce(searchInput, 300)

  const params = useMemo(() => ({
    ...(showFilter !== 'all' && { show: showFilter }),
    ...(debouncedSearch      && { search: debouncedSearch }),
    sort_by:  sortBy,
    per_page: perPage,
    page,
  }), [showFilter, debouncedSearch, sortBy, perPage, page])

  const { data, isLoading, isError, error, isFetching } = useDocuments(params)
  const actionMutation = useDocumentAction()
  const exportMutation = useDocumentExport()

  // ─── استخراج البيانات ──────────────────────────────────────────────────────
  // axios interceptor يفك تغليف Laravel تلقائياً:
  //   data = محتوى "data" من الباك إند مباشرة
  //   = { items: [...], total, current_page, last_page, per_page }
  const documents  = Array.isArray(data?.items) ? data.items
                   : Array.isArray(data?.data?.items) ? data.data.items
                   : Array.isArray(data) ? data
                   : []
  // استخراج كائن التقليب (pagination) بذكاء من الرد بناءً للاعتراضات
  const pagination = data?.pagination || data?.data?.pagination || null
  // ──────────────────────────────────────────────────────────────────────────

  const toggleSelect    = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const checkAll        = ()   => setSelected(documents.map(d => d.id))
  const uncheckAll      = ()   => setSelected([])
  const invertSelection = ()   => setSelected(documents.map(d => d.id).filter(id => !selected.includes(id)))

  const handleSingleAction = async (ids, action, successMsg) => {
    if (action === 'Delete' && !window.confirm('هل أنت متأكد؟')) return
    try {
      await actionMutation.mutateAsync({ ids, action })
      toast.success(successMsg)
    } catch {}
  }

  const handleBulkAction = async () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'Delete' && !window.confirm(`هل أنت متأكد من حذف ${selected.length} مستند؟`)) return
    try {
      await actionMutation.mutateAsync({ ids: selected, action: bulkAction })
      toast.success(`تم تنفيذ ${bulkAction} على ${selected.length} مستند`)
      setSelected([])
      setBulkAction('')
    } catch {}
  }

  const handleExport = async () => {
    try {
      // responseType='blob' → interceptor يرجع axios response كاملاً
      const res = await exportMutation.mutateAsync(params)
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', `documents-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('تم تصدير الملف بنجاح')
    } catch {}
  }

  const handleFilterChange = (setter) => (val) => {
    setter(val)
    setPage(1)
    setSelected([])
  }

  const sideNavItems = [
    { id: 'manage', label: 'إدارة (Manage)',     icon: 'bi-file-earmark-text-fill', action: () => setActiveSideNav('manage') },
    { id: 'export', label: 'تصدير (Export CSV)', icon: 'bi-box-arrow-up',            action: () => setShowExportModal(true) },
  ]

  return (
    <div className="page-layout">

      {/* القائمة الجانبية */}
      <div className="page-sidebar">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {sideNavItems.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button type="button" onClick={item.action}
                style={{
                  width: '100%', textAlign: 'right', padding: '12px 16px',
                  background: activeSideNav === item.id ? TEAL : '#fafafa',
                  color: activeSideNav === item.id ? '#fff' : TEAL,
                  border: '1px solid #ddd', borderBottom: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
                  opacity: item.id === 'export' && exportMutation.isPending ? 0.6 : 1,
                }}>
                <i className={`bi ${item.icon}`} />
                {item.id === 'export' && exportMutation.isPending ? 'جاري...' : item.label}
              </button>
            </li>
          ))}
          <li style={{ borderTop: '1px solid #ddd' }}></li>
        </ul>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="page-content">

        {/* ترويسة Teal */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', justifyContent: 'space-between', borderRadius: '2px 2px 0 0'
        }}>
          <span>إدارة المستندات المحمية (Manage Documents)</span>
          {isFetching && !isLoading && (
            <span style={{ fontSize: 11, opacity: 0.85 }}>⚡ جاري التحديث...</span>
          )}
        </div>

        {/* صندوق الفلاتر */}
        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>

          {/* شريط البحث */}
          <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
            <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية (Filter)</label>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
              <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setPage(1) }}
                placeholder="بحث بالعنوان..."
                style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }}
              />
            </div>
          </div>

          {/* قوائم الفرز والحالة وعدد النتائج */}
          <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>فرز حسب (Sort by)</label>
              <select value={sortBy} onChange={e => handleFilterChange(setSortBy)(e.target.value)} style={filterSelectStyle}>
                <option value="title">الاسم (Name)</option>
                <option value="id">المعرف (ID)</option>
                <option value="published">تاريخ النشر (Published Date)</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>عرض (Show)</label>
              <select value={perPage} onChange={e => handleFilterChange(setPerPage)(Number(e.target.value))} style={filterSelectStyle}>
                <option value={2}>2</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>حالة (Status)</label>
              <select value={showFilter} onChange={e => handleFilterChange(setShowFilter)(e.target.value)} style={filterSelectStyle}>
                <option value="all">الكل (All)</option>
                <option value="valid">صالح (Valid)</option>
                <option value="suspended">موقوف (Suspended)</option>
                <option value="expired">منتهي (Expired)</option>
              </select>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

          {/* تحديد شامل */}
          <div className="mobile-check-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>الكل (All)</span>
            <a href="#" onClick={e => { e.preventDefault(); checkAll() }}         style={{ color: TEAL }}>تحديد (Check)</a>     <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }}       style={{ color: TEAL }}>إلغاء (Uncheck)</a>   <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس (Invert)</a>
          </div>

          {/* عمليات جماعية */}
          <div className="mobile-bulk-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, fontSize: 13 }}>
            <label style={{ fontWeight: 600 }}>مع كل المحدد (With all checked)</label>
            <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
              style={{ ...filterSelectStyle, minWidth: 200, flex: 1, maxWidth: 300 }}>
              <option value=""></option>
              <option value="Suspend">إيقاف (Suspend)</option>
              <option value="Activate">تفعيل (Activate)</option>
              <option value="Delete">حذف (Delete)</option>
            </select>
            <button type="button" onClick={handleBulkAction}
              disabled={!bulkAction || selected.length === 0 || actionMutation.isPending}
              style={{
                background: TEAL, color: '#fff', border: 'none', borderRadius: 2,
                padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                opacity: (!bulkAction || selected.length === 0 || actionMutation.isPending) ? 0.5 : 1
              }}>
              {actionMutation.isPending ? 'جاري...' : 'موافق (OK)'}
            </button>
          </div>
        </div>

        {/* مؤشر التحميل */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: TEAL, fontSize: 14, fontWeight: 600 }}>
            <i className="bi bi-arrow-repeat" style={{ marginLeft: 8, animation: 'spin 1s linear infinite' }} />
            جاري تحميل المستندات...
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* رسالة الخطأ */}
        {!isLoading && isError && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: '#f44336', marginBottom: 12, fontSize: 14 }}>&#9888;&#65039; {error?.message || 'حدث خطأ في جلب البيانات'}</p>
            <button onClick={() => window.location.reload()}
              style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              إعادة المحاولة (Retry)
            </button>
          </div>
        )}

        {/* عداد النتائج */}
        {!isLoading && !isError && (
          <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }} dir="ltr">
            {'>> '}<span>[{pagination?.total ?? documents.length}]</span>{' <<'}
          </div>
        )}

        {/* بطاقات المستندات */}
        {!isLoading && !isError && (
          <div>
            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                لا توجد مستندات مطابقة (No documents found)
              </div>
            ) : documents.map(doc => (
              <div key={doc.id} className="mobile-card" style={{
                display: 'flex', alignItems: 'stretch',
                background: '#f8f8f8', marginBottom: 16,
                borderRight: `8px solid ${borderColor[doc.status] || '#ccc'}`,
                borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
              }}>
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} />
                </div>
                <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
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
                        <td style={fieldLabelStyle}>العملاء (Customers)</td>
                        <td style={fieldValueStyle}>
                          <a href="#" onClick={e => { e.preventDefault(); navigate(`/documents/${doc.id}`, { state: { tab: 'access' } }) }}
                            style={{ color: TEAL, fontWeight: 'bold' }}>
                            {doc.customers_count ?? 0}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mobile-card-actions" style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                  <ActionIcon icon="bi-slash-circle" color="#ff9800" title="إيقاف (Suspend)"
                    onClick={() => handleSingleAction([doc.id], 'Suspend', 'تم إيقاف المستند')} />
                  <ActionIcon icon="bi-x" color="#f44336" title="حذف (Delete)" bold
                    onClick={() => handleSingleAction([doc.id], 'Delete', 'تم حذف المستند')} />
                  <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="عرض التفاصيل (View Details)"
                    onClick={() => navigate(`/documents/${doc.id}`)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* أزرار Pagination تعتمد أسهماً صغيرة */}
        {pagination && pagination.total > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, padding: '10px 0' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              title="السابق (Previous)"
              style={{
                background: page <= 1 ? '#eee' : '#fff', color: page <= 1 ? '#999' : TEAL,
                border: `1px solid ${page <= 1 ? '#ccc' : TEAL}`, borderRadius: 3, padding: '2px 12px', cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold', fontSize: 14
              }}>
              &lt;&lt;
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>
              [ {pagination.current_page} / {pagination.last_page} ]
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
              disabled={page >= pagination.last_page || isFetching}
              title="التالي (Next)"
              style={{
                background: page >= pagination.last_page ? '#eee' : '#fff',
                color: page >= pagination.last_page ? '#999' : TEAL,
                border: `1px solid ${page >= pagination.last_page ? '#ccc' : TEAL}`, borderRadius: 3, padding: '2px 12px',
                cursor: page >= pagination.last_page ? 'not-allowed' : 'pointer',
                fontWeight: 'bold', fontSize: 14
              }}>
              &gt;&gt;
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          نافذة التصدير — 4.8.11
      ═══════════════════════════════════════════ */}
      {showExportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowExportModal(false)}>
          <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 440, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px 4px 0 0' }}>
              <span><i className="bi bi-file-earmark-arrow-down" style={{ marginLeft: 6 }} /> تصدير المستندات (Export Documents)</span>
              <button onClick={() => setShowExportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>من هذا الإعداد يمكنك تصدير سجلات المستندات إلى ملف CSV</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
                <label style={{ fontWeight: 700, minWidth: 80 }}>Export type:</label>
                <select value={exportType} onChange={e => setExportType(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: 3, padding: '6px 12px', fontSize: 13, flex: 1 }}>
                  <option value="all">All</option>
                  <option value="valid">Valid only</option>
                  <option value="suspended">Suspended only</option>
                  <option value="expired">Expired only</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, fontSize: 13 }}>
                <label style={{ fontWeight: 700, minWidth: 80 }}>Format:</label>
                <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: 3, padding: '6px 12px', fontSize: 13, flex: 1 }}>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div style={{ textAlign: 'left' }}>
                <button onClick={() => { handleExport(); setShowExportModal(false) }}
                  disabled={exportMutation.isPending}
                  style={{
                    background: TEAL, color: '#fff', border: 'none', borderRadius: 3,
                    padding: '8px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    opacity: exportMutation.isPending ? 0.6 : 1
                  }}>
                  {exportMutation.isPending ? 'جاري التصدير...' : 'Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
