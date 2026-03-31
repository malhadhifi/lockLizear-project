import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addPublication } from '../store/publicationsSlice'
import toast from 'react-hot-toast'

const TEAL = '#009cad'

const CreatePublicationPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const publications = useSelector(state => state.publications.list)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [obeyStartDate, setObeyStartDate] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const newId = publications.length > 0 ? Math.max(...publications.map(p => p.id)) + 1 : 1
    dispatch(addPublication({
      id: newId, name, description, obeyStartDate,
      customersCount: 0, docsCount: 0, status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }))
    toast.success('تمت إضافة المنشور بنجاح!')
    navigate('/publications')
  }

  return (
    <div>
      {/* === عنوان === */}
      <div style={{
        background: TEAL, color: '#fff', padding: '10px 16px',
        fontWeight: 700, fontSize: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderRadius: '2px 2px 0 0'
      }}>
        <span>إضافة منشور (Add Publication)</span>
        <button onClick={() => navigate('/publications')}
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: 12, cursor: 'pointer' }}>
          ← رجوع
        </button>
      </div>

      {/* === النموذج === */}
      <div style={{ background: '#fff', border: `1px solid ${TEAL}`, borderTop: 'none', padding: '20px 24px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>

          {/* اسم المنشور */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>الاسم (Name)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              maxLength={64} required
              style={inputStyle} />
            <small style={{ color: '#888', fontSize: 11, display: 'block', marginTop: 4 }}>{name.length}/64 حرفاً</small>
          </div>

          {/* الوصف */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>الوصف (Description)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Obey Customer Start Date */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={obeyStartDate} onChange={e => setObeyStartDate(e.target.checked)}
              id="obeyCheck" />
            <label htmlFor="obeyCheck" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              الالتزام بتاريخ بدء العميل (Obey customer start date)
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

          {/* أزرار الإضافة */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={!name.trim()}
              style={{
                background: TEAL, color: '#fff', border: 'none',
                borderRadius: 3, padding: '8px 30px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer',
                opacity: !name.trim() ? 0.5 : 1
              }}>
              إضافة
            </button>
            <button type="button" onClick={() => navigate('/publications')}
              style={{
                background: '#f0f0f0', color: '#333', border: '1px solid #ccc',
                borderRadius: 3, padding: '8px 30px', fontSize: 13, cursor: 'pointer'
              }}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#333' }
const inputStyle = {
  width: '100%', border: '1px solid #ccc', borderRadius: 3,
  padding: '8px 12px', fontSize: 13, fontFamily: 'inherit'
}

export default CreatePublicationPage
