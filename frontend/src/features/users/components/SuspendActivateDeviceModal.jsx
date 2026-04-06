import { useState } from 'react'

const TEAL = '#009cad'

export default function SuspendActivateDeviceModal({ isOpen, onClose }) {
  // Temporary mock data for devices since backend might not have it yet
  const [machines, setMachines] = useState([
    { id: 1, name: 'BC-AE-C5-22-6B-22-285072491425', status: 'enabled' }
  ])
  const [selectedIds, setSelectedIds] = useState([])

  if (!isOpen) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Machines Registered (الأجهزة المسجلة)</span>
          <i className="bi bi-people-fill" />
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#fff' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
             <div style={{ fontSize: 13, color: TEAL }}>
                All &nbsp;&nbsp; 
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(machines.map(m => m.id)) }} style={{ textDecoration: 'none', color: TEAL }}>Check</a> | 
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds([]) }} style={{ textDecoration: 'none', color: TEAL }}> Uncheck</a> | 
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedIds(machines.map(m => m.id).filter(id => !selectedIds.includes(id))) }} style={{ textDecoration: 'none', color: TEAL }}> Invert</a>
             </div>
             <div style={{ display: 'flex', alignItems: 'center' }}>
               <div style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
                 <span style={{ fontSize: 13, color: '#333', marginRight: 8 }}>With all checked:</span>
                 <select style={inputStyle}>
                   <option>Suspend</option>
                   <option>Activate</option>
                 </select>
               </div>
               <button style={okBtnStyle} onClick={onClose}>OK</button>
             </div>
          </div>

          <div style={{ border: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <tr style={{ color: '#555' }}>
                  <th style={{ width: 40, padding: '12px 8px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={machines.length > 0 && selectedIds.length === machines.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(machines.map(m => m.id))
                        else setSelectedIds([])
                      }}
                    />
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Machine</th>
                  <th style={{ textAlign: 'center', padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((mac, idx) => {
                  const isChecked = selectedIds.includes(mac.id);
                  return (
                    <tr key={mac.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fff' : '#fdfdfd' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, mac.id])
                            else setSelectedIds(selectedIds.filter(id => id !== mac.id))
                          }} 
                        />
                      </td>
                      <td style={{ padding: '12px 8px', color: '#555' }}>{mac.name}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: mac.status === 'enabled' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                        {mac.status}
                      </td>
                    </tr>
                  )
                })}
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

// === الأنماط ===
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '10px'
}

const modalStyle = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: 650,
  borderRadius: 4,
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  fontFamily: 'Arial, sans-serif',
  maxHeight: '90vh',
  overflowY: 'auto'
}

const headerStyle = {
  backgroundColor: TEAL,
  color: '#fff',
  padding: '12px 20px',
  fontWeight: 'bold',
  fontSize: 15,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const inputStyle = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  fontSize: 13,
  outline: 'none',
  width: 120
}

const okBtnStyle = {
  backgroundColor: TEAL,
  color: '#fff',
  border: 'none',
  padding: '6px 20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  borderRadius: 4
}

const cancelBtnStyle = {
  backgroundColor: '#888',
  color: '#fff',
  border: 'none',
  padding: '6px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  borderRadius: 4
}
