import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updatePublication } from '../store/publicationsSlice'
import PublicationAccessList from '../components/PublicationAccessList'
import PublicationDocumentsList from '../components/PublicationDocumentsList'
import DocumentSelector from '../components/DocumentSelector'
import toast from 'react-hot-toast'

const TEAL = '#009cad'

const EditPublicationPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const publications = useSelector(state => state.publications.list)
  const publication = publications.find(p => p.id === parseInt(id))

  const initialTab = location.state?.tab || 'details'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showDocSelector, setShowDocSelector] = useState(false)

  const [name, setName] = useState(publication?.name || '')
  const [description, setDescription] = useState(publication?.description || '')
  const [obeyStartDate, setObeyStartDate] = useState(publication?.obeyStartDate || false)

  if (!publication) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ color: '#888' }}>المنشور غير موجود (Publication not found)</p>
        <button onClick={() => navigate('/publications')}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer' }}>
          العودة للقائمة
        </button>
      </div>
    )
  }

  const handleSave = () => {
    dispatch(updatePublication({ id: publication.id, name, description, obeyStartDate }))
    toast.success('تم تحديث المنشور بنجاح!')
  }

  const tabs = [
    { key: 'details', label: 'تعديل المنشور (Edit Publication)' },
    { key: 'documents', label: `المستندات (${publication.docsCount})` },
    { key: 'customers', label: `العملاء (${publication.customersCount})` },
  ]

  return (
    <div>
      {/* === عنوان === */}
      <div style={{
        background: TEAL, color: '#fff', padding: '10px 16px',
        fontWeight: 700, fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: '4px 4px 0 0'
      }}>
        <span>إدارة المنشور: {publication.name}</span>
        <button onClick={() => navigate('/publications')}
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: 12, cursor: 'pointer' }}>
          ← رجوع
        </button>
      </div>

      {/* === التبويبات === */}
      <div style={{ display: 'flex', background: '#f8f8f8', border: '1px solid #ccc', borderTop: 'none' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 700,
              background: activeTab === tab.key ? '#fff' : 'transparent',
              border: 'none',
              borderRight: '1px solid #ccc',
              borderBottom: activeTab === tab.key ? 'none' : '1px solid #ccc',
              borderTop: activeTab === tab.key ? `3px solid ${TEAL}` : '3px solid transparent',
              color: activeTab === tab.key ? TEAL : '#444',
              cursor: 'pointer',
              outline: 'none',
            }}>
            {tab.label}
          </button>
        ))}
        {/* Fill the remaining space with border-bottom */}
        <div style={{ flex: 1, borderBottom: '1px solid #ccc' }}></div>
      </div>

      {/* === المحتوى === */}
      <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: 'none', minHeight: 400 }}>

        {activeTab === 'details' && (
          <div style={{ padding: '24px 30px' }}>
            <div style={{ background: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 13, marginBottom: 20, borderRadius: 2 }}>
              تعديل تفاصيل المنشور (Edit Publication Details)
            </div>

            <form style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>الاسم (Name)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  maxLength={64} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>الوصف (Description)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={obeyStartDate} onChange={e => setObeyStartDate(e.target.checked)} id="obeyEdit" />
                <label htmlFor="obeyEdit" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>الالتزام بتاريخ بدء العميل (Obey customer start date)</label>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={handleSave}
                  style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  حفظ (OK)
                </button>
                <button type="button" onClick={() => navigate('/publications')}
                  style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 3, padding: '8px 30px', fontSize: 13, cursor: 'pointer' }}>
                  إلغاء (Cancel)
                </button>
              </div>
            </form>

            {/* معلومات النظام */}
            <div style={{ marginTop: 40, padding: '16px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 3, fontSize: 13, maxWidth: 800 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 14, color: TEAL }}>معلومات النظام:</h4>
              <table style={{ lineHeight: 1.8 }}>
                <tbody>
                  <tr><td style={flStyle}>معرف المنشور (ID):</td><td>{publication.id}</td></tr>
                  <tr><td style={flStyle}>عدد العملاء (Customers):</td><td>{publication.customersCount}</td></tr>
                  <tr><td style={flStyle}>عدد المستندات (Documents):</td><td>{publication.docsCount}</td></tr>
                  <tr><td style={flStyle}>تاريخ الإنشاء (Created):</td><td>{publication.createdAt}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note: The Inner components need to be checked if they render properly in RTL without breaking. */}
        {activeTab === 'documents' && (
          <div style={{ padding: '20px' }}>
            <PublicationDocumentsList onAddDocument={() => setShowDocSelector(true)} />
            <DocumentSelector isOpen={showDocSelector} onClose={() => setShowDocSelector(false)}
              existingDocIds={[1, 2, 4]} onDocumentsAdded={() => {}} />
          </div>
        )}

        {activeTab === 'customers' && (
          <div style={{ padding: '20px' }}>
             <PublicationAccessList />
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#333' }
const inputStyle = { width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit' }
const flStyle = { fontWeight: 700, paddingLeft: 16, color: '#555' }

export default EditPublicationPage
