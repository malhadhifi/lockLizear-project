import React from 'react'

const TEAL = '#009cad'

export default function WebViewerLoginHistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null

  // Mock data as seen in the image
  const history = [
    { ip: '31.50.66.69', date: '2016-06-22 21:57:54' }
  ]

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Web Viewer Login History</span>
          <i className="bi bi-people-fill" />
        </div>

        <div style={{ padding: '0px', backgroundColor: '#fff' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
              <tr style={{ color: '#333' }}>
                <th style={{ textAlign: 'left', padding: '12px 20px' }}>IP</th>
                <th style={{ textAlign: 'left', padding: '12px 20px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 20px', color: '#555' }}>
                    {item.ip} <img src="https://flagcdn.com/16x12/gb.png" alt="GB" style={{ marginLeft: 4 }} />
                  </td>
                  <td style={{ padding: '12px 20px', color: '#555' }}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
            <div style={{ display: 'flex', gap: 5, color: '#ccc', fontSize: 13 }}>
              <span>&laquo;</span>
              <span>&lsaquo;</span>
              <span style={{ color: TEAL }}>[1]</span>
              <span>&rsaquo;</span>
              <span>&raquo;</span>
            </div>
          </div>
          
        </div>
        
        {/* Note: The screenshot of Web Viewer Login History doesn't show an OK bottom button, but usually modals can be closed by clicking outside or having an "X". We'll add a close button for accessibility. */}
        <div style={{ borderTop: '1px solid #ccc', backgroundColor: '#e6e6e6', padding: '10px', textAlign: 'right' }}>
           <button onClick={onClose} style={cancelBtnStyle}>Close</button>
        </div>

      </div>
    </div>
  )
}

// === CSS Styles ===
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
  maxWidth: 500,
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

const cancelBtnStyle = {
  backgroundColor: '#888',
  color: '#fff',
  border: 'none',
  padding: '6px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  borderRadius: 4
}
