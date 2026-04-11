import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePublicationDocuments, useDetachDocument, useAttachDocuments } from '../hooks/usePublications'
import DocumentSelector from './DocumentSelector'

const TEAL = '#009cad'

const PublicationDocumentsList = ({ publicationId }) => {
  const { data: docsRes, isLoading } = usePublicationDocuments(publicationId)
  const docs = Array.isArray(docsRes?.data) ? docsRes.data : Array.isArray(docsRes) ? docsRes : []
  
  const detachMutation = useDetachDocument()
  const attachMutation = useAttachDocuments()
  const [showDocSelector, setShowDocSelector] = useState(false)
  const [selected, setSelected] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === docs.length ? [] : docs.map(d => d.id))

  const handleRemove = (docId) => {
    if (!window.confirm('هل تريد إزالة هذا المستند من المنشور؟ (Remove this document?)')) return
    detachMutation.mutate({ id: publicationId, document_id: docId })
  }

  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'remove') {
      selected.forEach(docId => detachMutation.mutate({ id: publicationId, document_id: docId }))
      toast.success(`تم إزالة ${selected.length} مستند`)
    }
    setSelected([])
    setBulkAction('')
  }

  return (
    <div>
      {/* شريط العنوان بلون TEAL */}
      <div style={{
        background: TEAL, color: '#fff', padding: '8px 16px',
        fontWeight: 700, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span>المستندات في المنشور (Documents) — {docs.length} مستند</span>
        <button onClick={() => setShowDocSelector(true)}
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 3, padding: '3px 10px', fontSize: 12, cursor: 'pointer' }}>
          + إضافة مستند (Add Document)
        </button>
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: 20, color: TEAL }}>جارٍ جلب المستندات... ⏳</div>}

      {/* الجدول */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#e8e8e8', borderBottom: `2px solid ${TEAL}` }}>
              <th style={thStyle}><input type="checkbox" checked={selected.length === docs.length && docs.length > 0} onChange={toggleAll} /></th>
              <th style={thStyle}>المعرف (ID)</th>
              <th style={thStyle}>العنوان (Title)</th>
              <th style={thStyle}>تاريخ النشر (Date Published)</th>
              <th style={thStyle}>تاريخ الانتهاء (Expiry Date)</th>
              <th style={thStyle}>إجراء (Action)</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && docs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
                لا توجد مستندات في هذا المنشور (No documents in this publication)
              </td></tr>
            ) : docs.map((d, idx) => (
              <tr key={d.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}><input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSelect(d.id)} /></td>
                <td style={tdStyle}>{d.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600, color: TEAL }}>{d.name || d.title}</td>
                <td style={tdStyle}>{d.publishedDate || d.created_at || '—'}</td>
                <td style={tdStyle}>{d.expiryDate || d.expires || '—'}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleRemove(d.id)} title="إزالة (Remove)" disabled={detachMutation.isPending}
                    style={{ background: 'none', border: `1px solid #d32f2f`, color: '#d32f2f', borderRadius: 3, padding: '2px 6px', cursor: 'pointer', fontSize: 11, opacity: detachMutation.isPending ? 0.5 : 1 }}>
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
        <label style={{ fontWeight: 600 }}>مع كل المحدد (With all checked):</label>
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
          <option value="">-- اختر --</option>
          <option value="remove">إزالة من المنشور (Remove)</option>
        </select>
        <button onClick={handleBulkAction} disabled={!bulkAction || !selected.length}
          style={{
            background: TEAL, color: '#fff', border: 'none', borderRadius: 3,
            padding: '4px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 700,
            opacity: (!bulkAction || !selected.length) ? 0.5 : 1
          }}>
          OK
        </button>
        {selected.length > 0 && <span style={{ color: '#555' }}>({selected.length} محدد)</span>}
      </div>

      {/* مودال اختيار المستندات لإضافتها */}
      <DocumentSelector 
        isOpen={showDocSelector} 
        onClose={() => setShowDocSelector(false)}
        existingDocIds={docs.map(d => d.id)} 
        onDocumentsAdded={(addedDocs) => {
          const ids = addedDocs.map(d => d.id)
          attachMutation.mutate({ id: publicationId, document_ids: ids }, {
            onSuccess: () => {
              toast.success(`تم إرفاق ${ids.length} مستند بنجاح!`)
            }
          })
        }} 
      />
    </div>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#333', whiteSpace: 'nowrap' }
const tdStyle = { padding: '8px 12px', textAlign: 'right', fontSize: 13, verticalAlign: 'middle' }

export default PublicationDocumentsList
