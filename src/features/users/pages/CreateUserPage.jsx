/**
 * ملف: CreateUserPage.jsx
 * الوظيفة: إضافة عميل جديد (Add New Customer)
 * الوصف استناداً إلى دليل LockLizard: 
 * - هذه الصفحة مسؤولة عن عرض نموذج الإضافة الخاص بالعملاء الجدد.
 * - واجهة المستخدم مطابقة بالكامل للتصميم الأصلي (إصدار V5) بنمط الصناديق (Boxes).
 * - تتضمن الحقول الأساسية: الاسم، الشركة، البريد الإلكتروني، التراخيص، تواريخ الصلاحية.
 * - تتضمن قسماً لـ "إدارة الوصول" (Manage Access) مع روابط وهمية للإشارة لضرورة حفظ العميل أولاً.
 * - تتضمن معلومات الترخيص (License Information).
 * - تم استبعاد عارض الويب بناءً على الطلب الأخير.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TEAL = '#009cad'
const GRAY_BG = '#e6e6e6'
const BORDER_COLOR = '#b3d9ff'

const CreateUserPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', company: '', email: '', licenses: 1,
    startDate: '', validUntil: '', neverExpires: true,
    notes: '',
    emailLicense: true,
    enableWebViewer: false,
    emailLoginDetails: true
  })

  const submit = (e) => {
    e.preventDefault()
    toast.success('تمت إضافة العميل بنجاح!')
    navigate('/users')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Top action info (optional, just space) */}
      <div style={{ marginBottom: 15 }} />

      {/* === Container === */}
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        border: `1px solid ${TEAL}`, 
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: TEAL, color: '#fff', padding: '6px 12px',
          fontWeight: 'bold', fontSize: 13,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>إضافة عميل جديد (New customer)</span>
          </div>
          <i className="bi bi-person-plus-fill" />
        </div>

        <form onSubmit={submit}>
          
          {/* Main Info Section */}
          <div style={{ padding: '15px 20px' }}>
            
            <div style={rowStyle}>
              <div style={labelColStyle}>الاسم (Name):</div>
              <div style={inputColStyle}>
                <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>الشركة (Company):</div>
              <div style={inputColStyle}>
                <input type="text" name="company" value={form.company} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>البريد الإلكتروني (E-mail):</div>
              <div style={inputColStyle}>
                <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>التراخيص (Licenses):</div>
              <div style={inputColStyle}>
                <input type="number" name="licenses" value={form.licenses} onChange={handleChange} min={1} style={{ ...inputStyle, width: 80 }} />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>تاريخ البدء (Start Date):</div>
              <div style={inputColStyle}>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={{ ...inputStyle, width: 140 }} />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>صالح حتى (Valid until):</div>
              <div style={inputColStyle}>
                <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} disabled={form.neverExpires} style={{ ...inputStyle, width: 140, backgroundColor: form.neverExpires ? '#f5f5f5' : '#fff' }} />
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" name="neverExpires" checked={form.neverExpires} onChange={handleChange} id="neverExp" />
                  <label htmlFor="neverExp" style={{ fontSize: 12, color: '#555', cursor: 'pointer' }}>لا تنتهي صلاحيته أبدًا (never expires)</label>
                </div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelColStyle}>ملاحظات (Notes):</div>
              <div style={inputColStyle}>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

          </div>

          {/* Manage Access Section */}
          <div style={sectionHeaderStyle}>إدارة الوصول (Manage Access)</div>
          <div style={{ padding: '12px 20px' }}>
            <div style={{ marginBottom: 8 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('يجب إضافة العميل أولاً (Save user first)') }} style={linkStyle}>
                <i className="bi bi-journal-text" style={{ marginRow: 6 }} /> تعيين الوصول للمنشورات (Set Publication Access)
              </a>
            </div>
            <div>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('يجب إضافة العميل أولاً (Save user first)') }} style={linkStyle}>
                <i className="bi bi-file-earmark-text" style={{ marginRow: 6 }} /> تعيين الوصول للمستندات (Set Document Access)
              </a>
            </div>
          </div>

          {/* License Information Section */}
          <div style={sectionHeaderStyle}>معلومات الترخيص (License Information)</div>
          <div style={{ padding: '12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" name="emailLicense" checked={form.emailLicense} onChange={handleChange} id="emailLic" />
              <label htmlFor="emailLic" style={{ fontSize: 13, cursor: 'pointer', color: '#333' }}>إرسال الترخيص بالبريد (Email license)</label>
            </div>
          </div>

          <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #ccc' }} />

          {/* Footer Actions */}
          <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
             <button type="submit" 
              style={{
                backgroundColor: TEAL, color: '#fff', border: 'none',
                padding: '8px 30px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold'
              }}>
              إضافة (Add)
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Styles perfectly matched to the LockLizard admin panel exact tabular look
const rowStyle = { 
  display: 'flex', 
  marginBottom: 10 
}
const labelColStyle = { 
  width: 140, 
  fontWeight: 'bold', 
  fontSize: 12, 
  color: '#333',
  paddingTop: 6
}
const inputColStyle = { 
  flex: 1 
}
const inputStyle = { 
  width: '100%', 
  maxWidth: 350,
  border: '1px solid #ccc', 
  padding: '6px 8px', 
  fontSize: 13,
  outline: 'none',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
}
const sectionHeaderStyle = {
  backgroundColor: GRAY_BG,
  color: '#555',
  fontWeight: 'bold',
  fontSize: 12,
  padding: '6px 20px',
  borderTop: '1px solid #ccc',
  borderBottom: '1px solid #ccc'
}
const linkStyle = {
  color: TEAL,
  textDecoration: 'none',
  fontSize: 13,
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'underline'
}

export default CreateUserPage
