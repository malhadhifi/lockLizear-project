/**
 * SelectPublicationModal.jsx - نافذة تحديد وصول المنشورات مع كامل العمليات
 * يشمل نوافذ فرعية (view) لعرض عملاء ومستندات كل منشور
 */
import { useState, useEffect, useMemo } from 'react'
import { usePublications } from '../../publications/hooks/usePublications'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const TEAL = '#009cad'

// ========== نافذة فرعية: عرض عملاء المنشور ==========
function ViewCustomersPopup({ pubId, pubName, onClose }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pubId) return
    setLoading(true)
    api.get(`/library/publications/${pubId}/subscribers`)
      .then(res => {
        const data = res?.data || res || []
        setCustomers(Array.isArray(data) ? data : data?.items || [])
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [pubId])

  return (
    <div style={subOverlay}>
      <div style={{ ...subModal, width: 500 }}>
        <div style={subHeader}>
          <span><i className="bi bi-people" /> عملاء المنشور: {pubName}</span>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>
        <div style={{ padding: 16, maxHeight: 350, overflowY: 'auto', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: TEAL }}>جاري التحميل... ⏳</div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>لا يوجد عملاء لهذا المنشور</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f8f8' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Access</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id || i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{c.id || i + 1}</td>
                    <td style={tdStyle}>{c.name || '-'}</td>
                    <td style={tdStyle}>{c.email || '-'}</td>
                    <td style={tdStyle}>{c.company || '-'}</td>
                    <td style={{ ...tdStyle, color: '#4caf50', fontWeight: 'bold' }}>
                      {c.pivot?.access_type || c.access_type || 'unlimited'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#666' }}>
            إجمالي العملاء: {customers.length}
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== نافذة فرعية: عرض مستندات المنشور ==========
function ViewDocumentsPopup({ pubId, pubName, onClose }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pubId) return
    setLoading(true)
    api.get(`/library/publications/${pubId}/documents`)
      .then(res => {
        const data = res?.data || res || []
        setDocuments(Array.isArray(data) ? data : data?.items || [])
      })
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false))
  }, [pubId])

  return (
    <div style={subOverlay}>
      <div style={{ ...subModal, width: 500 }}>
        <div style={subHeader}>
          <span><i className="bi bi-file-earmark-pdf" /> مستندات المنشور: {pubName}</span>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>
        <div style={{ padding: 16, maxHeight: 350, overflowY: 'auto', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: TEAL }}>جاري التحميل... ⏳</div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>لا توجد مستندات لهذا المنشور</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f8f8' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Published</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={d.id || i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{d.id}</td>
                    <td style={tdStyle}>{d.title || d.name || '-'}</td>
                    <td style={tdStyle}>{d.created_at || d.published || '-'}</td>
                    <td style={{ ...tdStyle, color: (d.status === 'valid' || !d.status) ? '#4caf50' : '#e65100', fontWeight: 'bold' }}>
                      {d.status || 'valid'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#666' }}>
            إجمالي المستندات: {documents.length}
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== المودال الرئيسي ==========
export default function SelectPublicationModal({ isOpen, onClose, onSelect, initialSelectedIds = [] }) {
  const { data: pubData, isLoading } = usePublications({ limit: 1000 })
  const publications = Array.isArray(pubData?.items) ? pubData.items : Array.isArray(pubData?.data?.items) ? pubData.data.items : Array.isArray(pubData) ? pubData : []

  const [selectedIds, setSelectedIds] = useState(initialSelectedIds)
  const [filterText, setFilterText] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [showAtLeast, setShowAtLeast] = useState(25)
  const [pubFilter, setPubFilter] = useState('all')
  const [withChecked, setWithChecked] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')

  // نوافذ view الفرعية
  const [viewCustomers, setViewCustomers] = useState(null) // { id, name }
  const [viewDocuments, setViewDocuments] = useState(null) // { id, name }

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialSelectedIds)
      setFilterText('')
      setWithChecked('')
      setValidFrom('')
      setValidUntil('')
      setViewCustomers(null)
      setViewDocuments(null)
    }
  }, [isOpen]) // FIXED INFINITE LOOP by removing initialSelectedIds

  const filtered = useMemo(() => {
    let result = [...publications]
    if (filterText.trim()) {
      const s = filterText.toLowerCase()
      result = result.filter(p => (p.name || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s))
    }
    if (pubFilter === 'with_access') {
      result = result.filter(p => selectedIds.includes(p.id))
    } else if (pubFilter === 'without_access') {
      result = result.filter(p => !selectedIds.includes(p.id))
    }
    result.sort((a, b) => {
      if (sortBy === 'title') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'id') return a.id - b.id
      return 0
    })
    return result
  }, [publications, filterText, sortBy, pubFilter, selectedIds])

  const displayed = filtered.slice(0, showAtLeast)

  if (!isOpen) return null

  const handleOK = () => {
    const selectedPubs = publications.filter(x => selectedIds.includes(x.id))
    if (selectedPubs.length === 0) {
      toast.error('الرجاء تحديد عنصر واحد على الأقل');
      return;
    }
    onSelect(selectedPubs, withChecked || 'grant_unlimited', validFrom, validUntil)
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Set Publication Access (تحديد وصول المنشورات)</span>
          <i className="bi bi-journal-text" />
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#fff' }}>
          
          <div style={filterBoxStyle}>
            {/* فلتر */}
            <div className="mobile-filter-row" style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Filter</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} style={inputStyle} placeholder="بحث بالاسم أو الوصف..." />
                <i className="bi bi-search" style={{ position: 'absolute', right: 8, top: 4, color: '#999' }} />
              </div>
            </div>
            
            {/* فرز */}
            <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Sort by</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: 140 }}>
                <option value="title">Title</option>
                <option value="id">ID</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: '#333' }}>Show at least</span>
                <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={{ ...inputStyle, width: 60 }}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                <span style={{ fontSize: 13, color: '#333' }}>Publications</span>
                <select value={pubFilter} onChange={e => setPubFilter(e.target.value)} style={{ ...inputStyle, width: 120 }}>
                  <option value="all">All</option>
                  <option value="with_access">With Access</option>
                  <option value="without_access">Without Access</option>
                </select>
              </div>
            </div>

            {/* Check/Uncheck + With all checked */}
            <div className="mobile-bulk-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, flexWrap: 'wrap', gap: 10 }}>
               <div className="mobile-check-row" style={{ fontSize: 13, color: TEAL }}>
                  All &nbsp;&nbsp; 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(filtered.map(d => d.id)) }} style={{ textDecoration: 'none', color: TEAL }}>Check</a> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds([]) }} style={{ textDecoration: 'none', color: TEAL }}> Uncheck</a> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(prev => filtered.map(d => d.id).filter(id => !prev.includes(id))) }} style={{ textDecoration: 'none', color: TEAL }}> Invert</a>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1, minWidth: 200 }}>
                   <span style={{ fontSize: 13, color: '#333' }}>With all checked</span>
                   <select value={withChecked} onChange={e => setWithChecked(e.target.value)} style={{ ...inputStyle, width: 180 }}>
                     <option value=""></option>
                     <option value="grant_unlimited">Grant Unlimited Access</option>
                     <option value="grant_limited">Grant Limited Access</option>
                     <option value="revoke">Revoke Access</option>
                   </select>
                 </div>
                 <button style={okBtnStyle} onClick={handleOK}>OK</button>
               </div>
            </div>

            {/* حقول التاريخ عند Limited */}
            {withChecked === 'grant_limited' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, padding: '10px 16px', background: '#f0f9fa', border: `1px solid ${TEAL}`, borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <label style={{ fontWeight: 700 }}>From:</label>
                  <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)}
                    style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <label style={{ fontWeight: 700 }}>Until:</label>
                  <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
                    style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
                </div>
              </div>
            )}
          </div>

          {/* عدد النتائج */}
          <div style={{ textAlign: 'center', fontSize: 12, color: TEAL, fontWeight: 'bold', margin: '8px 0' }}>
            {filtered.length} نتيجة {filtered.length !== publications.length && `(من ${publications.length})`}
          </div>

          {/* الجدول */}
          <div style={{ maxHeight: 300, overflowY: 'auto', overflowX: 'auto', borderBottom: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <tr style={{ borderBottom: '2px solid #ddd', color: '#555' }}>
                  <th style={{ width: 30, padding: 8 }}>
                    <input 
                      type="checkbox" 
                      checked={displayed.length > 0 && displayed.every(p => selectedIds.includes(p.id))}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(prev => [...new Set([...prev, ...displayed.map(p => p.id)])])
                        else setSelectedIds(prev => prev.filter(id => !displayed.map(p => p.id).includes(id)))
                      }}
                    />
                  </th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Access</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Obey</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Customers</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Documents</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: TEAL }}>جاري جلب المنشورات... ⏳</td></tr>
                )}
                {!isLoading && displayed.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#888' }}>لا توجد نتائج</td></tr>
                )}
                {!isLoading && displayed.map((pub, idx) => {
                  const isChecked = selectedIds.includes(pub.id);
                  return (
                  <tr key={pub.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fdfdfd' : '#fff' }}>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <input type="checkbox" checked={isChecked} onChange={(e) => {
                        if (e.target.checked) setSelectedIds(prev => [...prev, pub.id])
                        else setSelectedIds(prev => prev.filter(id => id !== pub.id))
                      }} />
                    </td>
                    <td style={{ padding: 8, color: '#333' }}>{pub.name}</td>
                    <td style={{ padding: 8, color: isChecked ? '#4caf50' : '#888', fontWeight: isChecked ? 'bold' : 'normal' }}>
                      {isChecked ? 'unlimited' : 'No'}
                    </td>
                    <td style={{ padding: 8, color: '#666' }}>{pub.description || 'A publication'}</td>
                    <td style={{ padding: 8, textAlign: 'center', color: '#666' }}>{pub.obeyStartDate ? 'yes' : 'no'}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setViewCustomers({ id: pub.id, name: pub.name }) }}
                        style={{ color: TEAL, textDecoration: 'none' }}><i className="bi bi-people" /> view</a>
                    </td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setViewDocuments({ id: pub.id, name: pub.name }) }}
                        style={{ color: TEAL, textDecoration: 'none' }}><i className="bi bi-file-earmark-pdf" /> view</a>
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

      {/* النوافذ الفرعية */}
      {viewCustomers && (
        <ViewCustomersPopup pubId={viewCustomers.id} pubName={viewCustomers.name}
          onClose={() => setViewCustomers(null)} />
      )}
      {viewDocuments && (
        <ViewDocumentsPopup pubId={viewDocuments.id} pubName={viewDocuments.name}
          onClose={() => setViewDocuments(null)} />
      )}
    </div>
  )
}

// ========== أنماط ==========
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }
const modalStyle = { width: '100%', maxWidth: 750, backgroundColor: '#fff', border: `1px solid ${TEAL}`, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '90vh', overflow: 'auto' }
const headerStyle = { backgroundColor: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 'bold', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const filterBoxStyle = { border: `1px solid ${TEAL}`, backgroundColor: '#f6f9fc', padding: '16px', marginBottom: 10 }
const inputStyle = { border: '1px solid #ccc', padding: '4px 8px', fontSize: 13, outline: 'none', width: '100%' }
const okBtnStyle = { backgroundColor: TEAL, color: '#fff', border: 'none', padding: '4px 20px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }
const cancelBtnStyle = { backgroundColor: '#e0e0e0', color: '#333', border: 'none', padding: '4px 16px', fontSize: 13, cursor: 'pointer' }

// أنماط النوافذ الفرعية
const subOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const subModal = { backgroundColor: '#fff', border: `2px solid ${TEAL}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', maxHeight: '80vh', overflow: 'auto' }
const subHeader = { backgroundColor: TEAL, color: '#fff', padding: '8px 16px', fontWeight: 'bold', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const closeBtnStyle = { background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }
const thStyle = { textAlign: 'left', padding: '6px 10px', fontWeight: 'bold', fontSize: 12, color: '#555' }
const tdStyle = { padding: '6px 10px', fontSize: 12, color: '#333' }
