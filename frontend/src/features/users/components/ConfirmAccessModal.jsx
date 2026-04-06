/**
 * ملف: ConfirmAccessModal.jsx
 * الوظيفة: تأكيد منح الصلاحية (Confirm Access Modal)
 * الوصف استناداً إلى دليل LockLizard: 
 * - هذه النافذة تظهر كخطوة تأكيدية أخيرة قبل تطبيق صلاحيات (المنشورات أو المستندات) على العملاء.
 * - تحتوي النافذة على مساحة بيضاء بسيطة تسرد بصيغة محددة الكلمة: "You will GRANT ACCESS to X customers:"
 * - يتم سرد العملاء المحددين (الاسم، البريد الاكتروني، الشركة).
 * - زران أساسيان بالإنجليزية: "GRANT ACCESS" بلون Teal، و "Cancel" بلون رمادي، وهما مطابقان للتصميم الأصلي تماماً.
 */
import React from 'react'

const TEAL = '#009cad'

export default function ConfirmAccessModal({ isOpen, onClose, onConfirm, actionText, customers, resourceName }) {
  if (!isOpen) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <div style={headerStyle}>
          Please confirm (يرجى التأكيد)
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#fff', fontSize: 13, color: '#333' }}>
          
          <div style={{ marginBottom: 15, fontWeight: 'bold' }}>
            You will {actionText} to {customers.length} customers:
          </div>
          
          <ul style={{ listStyleType: 'none', paddingLeft: 10, margin: '0 0 20px 0', lineHeight: 1.6 }}>
            {customers.map(c => (
               <li key={c.id}>- {c.name} ({c.email}) {c.company}</li>
            ))}
          </ul>
          
          {resourceName && (
             <div style={{ marginBottom: 20, color: TEAL, fontWeight: 'bold' }}>
                Resource: {resourceName}
             </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onConfirm} style={confirmBtnStyle}>GRANT ACCESS</button>
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
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '10px'
}
const modalStyle = {
  width: '100%', maxWidth: 500, backgroundColor: '#fff', border: `1px solid ${TEAL}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto'
}
const headerStyle = {
  backgroundColor: TEAL, color: '#fff', padding: '10px 16px',
  fontWeight: 'bold', fontSize: 13
}
const confirmBtnStyle = {
  backgroundColor: TEAL, color: '#fff', border: 'none',
  padding: '6px 20px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer'
}
const cancelBtnStyle = {
  backgroundColor: '#888', color: '#fff', border: 'none',
  padding: '6px 20px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer'
}
