import React from 'react'

const TEAL = '#009cad'

export default function EmailDeliveryStatusModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          <span>Email delivery status</span>
          <i className="bi bi-envelope-x" style={{ /* assuming locklizard has an envelope icon, using bootstrap icon */ }} />
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#fff', fontSize: 13, color: '#333' }}>
          
          <div style={{ border: '1px solid #ccc', padding: '10px', height: 200, overflowY: 'auto', backgroundColor: '#fafafa', whiteSpace: 'pre-line' }}>
            {`doc 10-14-2016 11:58:25
for: alice.pierce@locklizard.com
Status: Sent

doc 10-14-2016 11:58:27
Status: Delivered
Details: smtp;250 ok 1476446307 qp 25307 server-6.tower-123.messagelabs.com!1476446305!416754!1
Destination: cluster3.eu.messagelabs.com (85.158.136.3)

doc 10-14-2016 11:59:01
Status: Opened
Details: Email opened for 10 seconds with Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; Microsoft Outlook 14.0.7172; ms-office; MSOffice 14) from London, England: `}
          </div>

        </div>

        <div style={{ borderTop: '1px solid #ccc', backgroundColor: '#e6e6e6', padding: '10px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
           <button style={cancelBtnStyle}>Refresh</button>
           <button onClick={onClose} style={okBtnStyle}>OK</button>
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
  padding: '8px 12px',
  fontWeight: 'bold',
  fontSize: 13,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const okBtnStyle = {
  backgroundColor: TEAL,
  color: '#fff',
  border: 'none',
  padding: '6px 20px',
  cursor: 'pointer',
  fontWeight: 'bold', // LockLizard usually puts a bit of weight on buttons
  borderRadius: 4
}

const cancelBtnStyle = {
  backgroundColor: '#f1f1f1',
  color: '#333',
  border: '1px solid #ccc',
  padding: '6px 16px',
  cursor: 'pointer',
  borderRadius: 4
}
