/**
 * ملف: SelectPublicationModal.jsx
 * الوظيفة: اختيار المنشور المتاح للعميل (Select Publication Modal)
 * الوصف استناداً إلى دليل LockLizard: 
 * - هذه النافذة المنبثقة تظهر عند طلب منح صلاحية وصول لمنشور محدد لعميل أو مجموعة عملاء.
 * - التخطيط يطابق حرفياً النافذة المنبثقة للنسخة الأصلية:
 *   - مربع التصفية (Filter)
 *   - الفرز حسب (Sort by) و (Show at least)
 *   - جدول المنشورات يعرض (المعرف، الاسم، الوصف، Obey، روابط عرض العملاء والمستندات)
 * - تمت الإشارة للأزرار بالإنجليزية كالأصل (OK, Cancel) ودمج المسميات العربية بجانبها.
 */
import { useState } from 'react'
import { usePublications } from '../../publications/hooks/usePublications'

const TEAL = '#009cad'

export default function SelectPublicationModal({ isOpen, onClose, onSelect }) {
  const { data: pubData, isLoading } = usePublications({ limit: 1000 })
  const publications = pubData?.data?.items || []

  const [selectedId, setSelectedId] = useState(null)

  if (!isOpen) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Select Publication (تحديد المنشور)</span>
          <i className="bi bi-people-fill" />
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#fff' }}>
          
          <div style={filterBoxStyle}>
            <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Filter</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <input type="text" style={inputStyle} />
                <i className="bi bi-search" style={{ position: 'absolute', right: 8, top: 4, color: '#999' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 80, fontWeight: 'bold', fontSize: 13, color: '#333' }}>Sort by</span>
              <select style={{ ...inputStyle, width: 200, marginRight: 20 }}>
                <option>name</option>
              </select>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#333', marginRight: 8 }}>Show at least</span>
                <select style={{ ...inputStyle, width: 60 }}>
                  <option>25</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <button style={okBtnStyle}>OK</button>
            </div>
          </div>

          <div style={{ maxHeight: 300, overflowY: 'auto', marginTop: 15, borderBottom: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <tr style={{ borderBottom: '2px solid #ddd', color: '#555' }}>
                  <th style={{ width: 30, padding: 8 }}></th>
                  <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Obey</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Customers</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Documents</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} style={{ padding: 20, textAlign: 'center', color: TEAL }}>
                      جاري جلب المنشورات... ⏳
                    </td>
                  </tr>
                )}
                {!isLoading && publications.map((pub, idx) => (
                  <tr key={pub.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fdfdfd' : '#fff' }}>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <input type="radio" name="selectPub" checked={selectedId === pub.id} onChange={() => setSelectedId(pub.id)} />
                    </td>
                    <td style={{ padding: 8 }}>{pub.id}</td>
                    <td style={{ padding: 8 }}>{pub.name}</td>
                    <td style={{ padding: 8, color: '#666' }}>{pub.description || pub.desc}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{pub.obey ? 'yes' : 'no'}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      {pub.customersCount ?? 0}
                    </td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      {pub.docsCount ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
            <button 
              onClick={() => { 
                const p = publications.find(x => x.id === selectedId); 
                onSelect(p) 
              }} 
              disabled={!selectedId}
              style={{ ...okBtnStyle, padding: '6px 24px', opacity: selectedId ? 1 : 0.5 }}
            >
              OK
            </button>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          </div>

        </div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const modalStyle = {
  width: 700, backgroundColor: '#fff', border: `1px solid ${TEAL}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
}
const headerStyle = {
  backgroundColor: TEAL, color: '#fff', padding: '10px 16px',
  fontWeight: 'bold', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
}
const filterBoxStyle = {
  border: `1px solid ${TEAL}`,
  backgroundColor: '#f6f9fc',
  padding: '16px',
  marginBottom: 10
}
const inputStyle = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  fontSize: 13,
  outline: 'none',
  width: '100%'
}
const okBtnStyle = {
  backgroundColor: TEAL, color: '#fff', border: 'none',
  padding: '4px 20px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer'
}
const cancelBtnStyle = {
  backgroundColor: '#e0e0e0', color: '#333', border: 'none',
  padding: '4px 16px', fontSize: 13, cursor: 'pointer'
}
