import { useState, useEffect } from 'react'
import api from '../../../lib/axios'

const TEAL = '#009cad'

export default function SelectCustomerModal({ isOpen, onClose, onSelect, multiple = false }) {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      api.get('/customer-management/customer-licenses', { params: { limit: 1000 } })
        .then(res => {
          setCustomers(res.data?.data?.items || [])
        })
        .finally(() => setIsLoading(false))
    } else {
      setSelectedIds([])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSelect = (id) => {
    if (multiple) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    } else {
      setSelectedIds([id])
    }
  }

  const toggleAll = () => {
    if (selectedIds.length === customers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(customers.map(c => c.id))
    }
  }
  
  const invertAll = () => {
    const newSelected = customers.filter(c => !selectedIds.includes(c.id)).map(c => c.id)
    setSelectedIds(newSelected)
  }

  const handleOk = () => {
    if (multiple) {
      const selectedCustomers = customers.filter(c => selectedIds.includes(c.id))
      onSelect(selectedCustomers)
    } else {
      const d = customers.find(x => x.id === selectedIds[0])
      onSelect(d)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Select Customer(s) (تحديد عميل)</span>
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

            {multiple && (
              <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, color: TEAL }}>
                    All &nbsp;&nbsp; 
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleAll(); }} style={{ textDecoration: 'none', color: TEAL }}>Check</a> | 
                    <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds([]); }} style={{ textDecoration: 'none', color: TEAL }}> Uncheck</a> | 
                    <a href="#" onClick={(e) => { e.preventDefault(); invertAll(); }} style={{ textDecoration: 'none', color: TEAL }}> Invert</a>
                </div>
              </div>
            )}
          </div>

          <div style={{ maxHeight: 300, overflowY: 'auto', marginTop: 15, borderBottom: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={3} style={{ padding: 20, textAlign: 'center', color: TEAL }}>
                      جاري جلب العملاء... ⏳
                    </td>
                  </tr>
                )}
                {!isLoading && customers.map((cust, idx) => (
                  <tr key={cust.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fdfdfd' : '#f5f5f5' }}>
                    <td style={{ padding: '12px 8px', width: 30, verticalAlign: 'top' }}>
                      <div style={{ width: 14, height: 14, backgroundColor: cust.status === 'enabled' ? '#4CAF50' : '#e65100', display: 'inline-block' }} />
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 'bold', color: TEAL, marginBottom: 4 }}>{cust.name}</div>
                      <table style={{ fontSize: 12 }}>
                         <tbody>
                            <tr><td style={{ width: 80, color: '#555' }}>ID:</td><td>{cust.id}</td></tr>
                            <tr><td style={{ color: '#555' }}>Email:</td><td>{cust.email}</td></tr>
                            <tr><td style={{ color: '#555' }}>Company:</td><td>{cust.company || 'N/A'}</td></tr>
                            <tr><td style={{ color: '#555' }}>Status:</td><td style={{ color: cust.status === 'enabled' ? '#4CAF50' : '#e65100', fontWeight: 'bold' }}>{cust.status}</td></tr>
                         </tbody>
                      </table>
                    </td>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', textAlign: 'right' }}>
                      {multiple ? (
                        <input type="checkbox" checked={selectedIds.includes(cust.id)} onChange={() => handleSelect(cust.id)} />
                      ) : (
                        <input type="radio" checked={selectedIds.includes(cust.id)} onChange={() => handleSelect(cust.id)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
            <button 
              onClick={handleOk} 
              disabled={selectedIds.length === 0}
              style={{ ...okBtnStyle, padding: '6px 24px', opacity: selectedIds.length > 0 ? 1 : 0.5 }}
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
