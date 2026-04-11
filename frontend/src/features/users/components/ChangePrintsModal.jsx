/**
 * ChangePrintsModal.jsx - نافذة تعديل عدد الطباعات مع فلاتر شغالة
 */
import { useState, useEffect, useMemo } from 'react'
import { useDocuments } from '../../documents/hooks/useDocuments'

const TEAL = '#009cad'

export default function ChangePrintsModal({ isOpen, onClose, userName = '' }) {
  // تعريف حالة الفلتر نصياً لربطها بالاستدعاء من الباك إند
  const [filterText, setFilterText] = useState('')

  // جلب المستندات بحد أقصى للسرعة (50) وتفعيل ميزة البحث عبر الباك إند مباشرة بدلا من 1000
  const { data: docData, isLoading } = useDocuments({ limit: 50, search: filterText })
  const documents = Array.isArray(docData?.items) ? docData.items : Array.isArray(docData?.data?.items) ? docData.data.items : Array.isArray(docData) ? docData : []

  const [selectedIds, setSelectedIds] = useState([])
  // const [filterText, setFilterText] = useState('') // تم نقله للأعلى
  const [sortBy, setSortBy] = useState('title')
  const [showAtLeast, setShowAtLeast] = useState(25)
  const [withChecked, setWithChecked] = useState('')

  useEffect(() => { if (isOpen) { setSelectedIds([]); setFilterText(''); setWithChecked('') } }, [isOpen])

  const filtered = useMemo(() => {
    let result = [...documents]
    if (filterText.trim()) {
      const s = filterText.toLowerCase()
      result = result.filter(d => (d.title || d.name || '').toLowerCase().includes(s))
    }
    result.sort((a, b) => {
      if (sortBy === 'title') return (a.title || a.name || '').localeCompare(b.title || b.name || '')
      if (sortBy === 'id') return a.id - b.id
      return 0
    })
    return result
  }, [documents, filterText, sortBy])

  const displayed = filtered.slice(0, showAtLeast)
  if (!isOpen) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <span>Change number of document prints for &quot;{userName}&quot;</span>
          <i className="bi bi-printer" />
        </div>
        <div style={{ padding: '20px 24px', backgroundColor: '#fff' }}>
          <div style={filterBoxStyle}>
            <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Filter</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} style={inputStyle} placeholder="بحث..." />
                <i className="bi bi-search" style={{ position: 'absolute', right: 8, top: 4, color: '#999' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Sort by</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: 140 }}>
                <option value="title">Title</option>
                <option value="id">ID</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: '#333' }}>Show at least</span>
                <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={{ ...inputStyle, width: 60 }}>
                  <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
               <div style={{ fontSize: 13, color: TEAL }}>
                  All &nbsp;&nbsp; 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(filtered.map(d => d.id)) }} style={{ textDecoration: 'none', color: TEAL }}>Check</a> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds([]) }} style={{ textDecoration: 'none', color: TEAL }}> Uncheck</a> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(prev => filtered.map(d => d.id).filter(id => !prev.includes(id))) }} style={{ textDecoration: 'none', color: TEAL }}> Invert</a>
               </div>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ marginRight: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                   <span style={{ fontSize: 13, color: '#333' }}>With all checked</span>
                   <select value={withChecked} onChange={e => setWithChecked(e.target.value)} style={{ ...inputStyle, width: 120 }}>
                     <option value=""></option>
                   </select>
                 </div>
                 <button style={okBtnStyle} onClick={onClose}>OK</button>
               </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: TEAL, fontWeight: 'bold', margin: '8px 0' }}>{filtered.length} نتيجة</div>
          <div style={{ maxHeight: 300, overflowY: 'auto', borderBottom: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {isLoading && (<tr><td style={{ padding: 20, textAlign: 'center', color: TEAL }}>جاري جلب المستندات... ⏳</td></tr>)}
                {!isLoading && displayed.length === 0 && (<tr><td style={{ padding: 20, textAlign: 'center', color: '#888' }}>لا توجد نتائج</td></tr>)}
                {!isLoading && displayed.map((doc) => {
                  const isChecked = selectedIds.includes(doc.id);
                  return (
                  <tr key={doc.id}>
                    <td style={{ paddingBottom: 15 }}>
                      <div style={{ backgroundColor: '#e9ecef', padding: '6px 10px', display: 'flex', alignItems: 'center', borderLeft: isChecked ? '4px solid #4CAF50' : '4px solid #ccc' }}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => {
                          if (e.target.checked) setSelectedIds(prev => [...prev, doc.id])
                          else setSelectedIds(prev => prev.filter(id => id !== doc.id))
                        }} style={{ marginRight: 10 }} />
                        <span style={{ color: isChecked ? '#4CAF50' : '#555', fontWeight: 'bold' }}>{doc.title || doc.name}</span>
                      </div>
                      <div style={{ backgroundColor: '#fdfdfd', border: '1px solid #eee', borderTop: 'none', padding: '8px 12px' }}>
                        <table style={{ width: '100%', fontSize: 13, color: '#333' }}>
                          <tbody>
                            <tr><td style={{ width: 120, fontWeight: 'bold', padding: '2px 0' }}>ID:</td><td>{doc.id}</td></tr>
                            <tr><td style={{ fontWeight: 'bold', padding: '2px 0' }}>Published:</td><td>{doc.published || doc.created_at || '-'}</td></tr>
                            <tr><td style={{ fontWeight: 'bold', padding: '2px 0' }}>Status:</td><td style={{ color: '#4CAF50', fontWeight: 'bold' }}>{doc.status || 'valid'}</td></tr>
                            <tr><td style={{ fontWeight: 'bold', padding: '2px 0' }}>Expires:</td><td>never</td></tr>
                            <tr><td style={{ fontWeight: 'bold', padding: '2px 0' }}>Prints Left:</td><td style={{ fontWeight: 'bold' }}>5</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }
const modalStyle = { width: '100%', maxWidth: 750, backgroundColor: '#fff', border: `1px solid ${TEAL}`, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '90vh', overflow: 'auto' }
const headerStyle = { backgroundColor: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 'bold', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const filterBoxStyle = { border: `1px solid ${TEAL}`, backgroundColor: '#f6f9fc', padding: '16px', marginBottom: 10 }
const inputStyle = { border: '1px solid #ccc', padding: '4px 8px', fontSize: 13, outline: 'none', width: '100%' }
const okBtnStyle = { backgroundColor: TEAL, color: '#fff', border: 'none', padding: '4px 20px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }
const cancelBtnStyle = { backgroundColor: '#e0e0e0', color: '#333', border: 'none', padding: '4px 16px', fontSize: 13, cursor: 'pointer' }
