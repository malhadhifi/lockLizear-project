import { useState } from 'react'
import toast from 'react-hot-toast'

const MOCK_DOCS = [
  { id: 1, name: 'دورة React الكاملة', status: 'valid', publishedDate: '2026-01-10', webViewer: 'Yes' },
  { id: 2, name: 'احتراف Laravel', status: 'valid', publishedDate: '2026-01-15', webViewer: 'No' },
  { id: 4, name: 'دليل تصميم قواعد البيانات', status: 'valid', publishedDate: '2025-12-20', webViewer: 'Yes' },
]

const PublicationDocumentsList = ({ onAddDocument }) => {
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [selected, setSelected] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === docs.length ? [] : docs.map(d => d.id))

  const handleRemove = (docId) => {
    if (!window.confirm('هل تريد إزالة هذا المستند من المنشور؟')) return
    setDocs(d => d.filter(x => x.id !== docId))
    toast.success('تم إزالة المستند')
  }

  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'remove') {
      setDocs(d => d.filter(x => !selected.includes(x.id)))
      toast.success(`تم إزالة ${selected.length} مستند`)
    }
    setSelected([])
    setBulkAction('')
  }

  const statusLabel = (status) => {
    if (status === 'valid') return <span style={{ color: '#2e7d32', fontWeight: 600 }}>صالح ✓</span>
    if (status === 'suspended') return <span style={{ color: '#e65100', fontWeight: 600 }}>موقوف</span>
    return <span style={{ color: '#c62828', fontWeight: 600 }}>منتهي</span>
  }

  return (
    <div>
      {/* شريط العنوان الأزرق */}
      <div style={{
        background: '#0078d4', color: '#fff', padding: '8px 16px',
        fontWeight: 700, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span>المستندات في المنشور (Documents) — {docs.length} مستند</span>
        <button onClick={onAddDocument}
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 3, padding: '3px 10px', fontSize: 12, cursor: 'pointer' }}>
          + إضافة مستند
        </button>
      </div>

      {/* الجدول */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
              <th style={thStyle}><input type="checkbox" checked={selected.length === docs.length && docs.length > 0} onChange={toggleAll} /></th>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>اسم المستند</th>
              <th style={thStyle}>الحالة</th>
              <th style={thStyle}>تاريخ النشر</th>
              <th style={thStyle}>Web Viewer</th>
              <th style={thStyle}>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
                لا توجد مستندات في هذا المنشور
              </td></tr>
            ) : docs.map((d, idx) => (
              <tr key={d.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}><input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSelect(d.id)} /></td>
                <td style={tdStyle}>{d.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600, color: '#0078d4' }}>{d.name}</td>
                <td style={tdStyle}>{statusLabel(d.status)}</td>
                <td style={tdStyle}>{d.publishedDate}</td>
                <td style={tdStyle}>{d.webViewer}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleRemove(d.id)} title="إزالة"
                    style={{ background: 'none', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: 3, padding: '2px 6px', cursor: 'pointer', fontSize: 11 }}>
                    <i className="bi bi-x-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* شريط العمليات الجماعية */}
      <div style={{
        padding: '10px 16px', background: '#f0f0f0', borderTop: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
      }}>
        <label style={{ fontWeight: 600 }}>مع كل المحدد:</label>
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
          <option value="">-- اختر --</option>
          <option value="remove">إزالة من المنشور</option>
          <option value="suspend">تعليق</option>
          <option value="activate">تفعيل</option>
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

export default PublicationDocumentsList
