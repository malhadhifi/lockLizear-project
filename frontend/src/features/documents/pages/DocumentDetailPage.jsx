/**
 * ملف: DocumentDetailPage.jsx
 * الوظيفة: تفاصيل وإعدادات المستند
 * النمط: موحّد مع PublicationsListPage — data من useQuery = Laravel body مباشرةً
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  useDocumentDetail,
  useUpdateDocument,
  useDocumentAccessList,
} from '../hooks/useDocuments'

const TEAL = '#009cad'

const DocumentDetailPage = () => {
  const idParam  = parseInt(useParams().id, 10)
  const navigate = useNavigate()
  const location = useLocation()

  const initialTab = location.state?.tab || 'details'
  const [activeTab,   setActiveTab]   = useState(initialTab)
  const [description, setDescription] = useState('')
  const [expires,     setExpires]     = useState('')
  const [isSuspended, setIsSuspended] = useState(false)

  // React Query — جلب المستند
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useDocumentDetail(idParam)

  // ✅ documentService.getById يرجع data مباشرةً
  // فـ data = { data: { id, title, ... }, message: '...' }
  // أو data = { id, title, ... } إذا الباك إند لا يُغلّف
  const document = data?.data ?? data ?? null

  const updateMutation = useUpdateDocument()

  // React Query — قائمة الوصول (تبويبة access فقط)
  const {
    data: accessData,
    isLoading: accessLoading,
  } = useDocumentAccessList(activeTab === 'access' ? idParam : null)

  // ✅ نفس النمط — accessData = Laravel body مباشرةً
  const accessList = accessData?.data ?? accessData ?? []

  useEffect(() => {
    if (document) {
      setDescription(document.description || '')
      setExpires(document.expired || '')
      setIsSuspended(document.status === 'suspended')
    }
  }, [document])

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        <div style={{ color: TEAL, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>جاري تحميل تفاصيل المستند...</div>
        <div style={{ width: 36, height: 36, border: `4px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        <p style={{ color: '#d32f2f', fontSize: 16, marginBottom: 20 }}>&#9888;&#65039; {error?.message || 'حدث خطأ في جلب البيانات'}</p>
        <button onClick={() => refetch()}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, marginLeft: 10 }}>
          إعادة المحاولة (Retry)
        </button>
        <button onClick={() => navigate('/documents')}
          style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
          العودة للقائمة (Back to List)
        </button>
      </div>
    )
  }

  if (!document) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>المستند غير موجود (Document not found)</p>
        <button onClick={() => navigate('/documents')}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
          العودة لقائمة المستندات (Back to List)
        </button>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: document.id,
        data: {
          description,
          expired:  expires || null,
          status:   isSuspended ? 'suspended' : 'valid',
        },
      })
      toast.success('تم تحديث تفاصيل المستند بنجاح!')
    } catch {}
  }

  const tabs = [
    { key: 'details', label: 'تعديل المستند (Edit Document)' },
    { key: 'drm',     label: 'إعدادات الحماية (Security Settings)' },
    { key: 'access',  label: `العملاء/المنشورات (${document.customers_count ?? 0})` },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 100px)', padding: '0 10px' }}>
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', border: '1px solid #ccc' }}>

        {/* الترويسة */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>إدارة المستند (Manage Document): {document.title}</span>
          <button type="button" onClick={() => navigate('/documents')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            ← العودة للقائمة
          </button>
        </div>

        {/* التبويبات */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${TEAL}`, background: '#f5f5f5' }}>
          {tabs.map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeTab === tab.key ? TEAL : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#555',
                borderBottom: activeTab === tab.key ? `2px solid ${TEAL}` : 'none',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>

          {/* تبويبة التعديل */}
          {activeTab === 'details' && (
            <div style={{ maxWidth: 600 }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: 700, padding: '10px 16px', width: 180, color: '#111' }}>العنوان (Title)</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{document.title}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: 700, padding: '10px 16px', color: '#111' }}>المعرف (ID)</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{document.id}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: 700, padding: '10px 16px', color: '#111' }}>تاريخ النشر (Published)</td>
                    <td style={{ padding: '10px 0', color: '#333' }}>{document.published}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: 700, padding: '10px 16px', color: '#111', verticalAlign: 'top', paddingTop: 14 }}>الوصف (Description)</td>
                    <td style={{ padding: '10px 0' }}>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        style={{ width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '6px 8px', fontSize: 13, resize: 'vertical' }}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: 700, padding: '10px 16px', color: '#111' }}>تاريخ الانتهاء (Expires)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input
                        type="date"
                        value={expires}
                        onChange={e => setExpires(e.target.value)}
                        style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '10px 16px', color: '#111' }}>الحالة (Status)</td>
                    <td style={{ padding: '10px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={isSuspended}
                          onChange={e => setIsSuspended(e.target.checked)}
                        />
                        إيقاف المستند (Suspend Document)
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 20 }}>
                <button type="button" onClick={handleSave}
                  disabled={updateMutation.isPending}
                  style={{
                    background: TEAL, color: '#fff', border: 'none', borderRadius: 3,
                    padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    opacity: updateMutation.isPending ? 0.6 : 1
                  }}>
                  {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات (Save)'}
                </button>
              </div>
            </div>
          )}

          {/* تبويبة DRM */}
          {activeTab === 'drm' && (
            <div style={{ color: '#888', padding: 20, textAlign: 'center', fontSize: 14 }}>
              إعدادات الحماية (DRM Settings) — قيد التطوير
            </div>
          )}

          {/* تبويبة الوصول */}
          {activeTab === 'access' && (
            <div>
              {accessLoading ? (
                <div style={{ textAlign: 'center', padding: 30, color: TEAL }}>جاري تحميل قائمة الوصول...</div>
              ) : !Array.isArray(accessList) || accessList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: '#888' }}>
                  لا يوجد عملاء مصرح لهم بالوصول لهذا المستند
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: TEAL, color: '#fff' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>المعرف</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>الاسم</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>البريد الإلكتروني</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>تاريخ الصلاحية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessList.map((customer, i) => (
                      <tr key={customer.id ?? i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px 12px' }}>{customer.id}</td>
                        <td style={{ padding: '8px 12px' }}>{customer.name}</td>
                        <td style={{ padding: '8px 12px' }}>{customer.email}</td>
                        <td style={{ padding: '8px 12px' }}>{customer.expires_at ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentDetailPage
