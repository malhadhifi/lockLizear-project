/**
 * ملف: DocumentDetailPage.jsx
 * الوظيفة: تفاصيل وإعدادات المستند
 * تم الترحيل: من Redux → React Query hooks
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

  // ✔️ React Query — جلب المستند
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useDocumentDetail(idParam)

  // استخراج كائن المستند من الاستجابة
  const document = response?.data?.data ?? response?.data ?? null

  // ✔️ React Query — تحديث المستند
  const updateMutation = useUpdateDocument()

  // ✔️ React Query — قائمة الوصول (تبويبة access)
  const {
    data: accessData,
    isLoading: accessLoading,
  } = useDocumentAccessList(activeTab === 'access' ? idParam : null)

  const accessList = accessData?.data?.data ?? accessData?.data ?? []

  // تعبئة الحالات المحلية بعد جلب البيانات
  useEffect(() => {
    if (document) {
      setDescription(document.description || '')
      setExpires(document.expired || '')
      setIsSuspended(document.status === 'suspended')
    }
  }, [document])

  // ✔️ حالة التحميل
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        <div style={{ color: TEAL, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
          جاري تحميل تفاصيل المستند...
        </div>
        <div style={{ width: 36, height: 36, border: `4px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ✔️ حالة الخطأ
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

  // ✔️ حفظ التعديلات
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: document.id,
        data: {
          description,
          expired: expires || null,
          status: isSuspended ? 'suspended' : 'valid',
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
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: 12, cursor: 'pointer' }}>
            ← رجوع (Back)
          </button>
        </div>

        {/* شريط التبويبات */}
        <div style={{ display: 'flex', background: '#f8f8f8', borderBottom: '1px solid #ccc' }}>
          {tabs.map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 24px', fontSize: 13, fontWeight: 700,
                background: activeTab === tab.key ? '#fff' : 'transparent',
                border: 'none',
                borderRight: '1px solid #ccc',
                borderLeft: 'none',
                borderBottom: activeTab === tab.key ? '1px solid #fff' : 'none',
                borderTop: activeTab === tab.key ? `3px solid ${TEAL}` : '3px solid transparent',
                color: activeTab === tab.key ? TEAL : '#555',
                cursor: 'pointer', outline: 'none',
                position: 'relative', top: activeTab === tab.key ? 1 : 0,
              }}>
              {tab.label}
            </button>
          ))}
          <div style={{ flex: 1 }}></div>
        </div>

        {/* محتوى التبويبات */}
        <div style={{ background: '#fff', minHeight: 450 }}>

          {/* تبويبة 1: التفاصيل */}
          {activeTab === 'details' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                معلومات عامة (General Information)
              </div>
              <div style={{ maxWidth: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111' }}>العنوان (Title)</label>
                  <div style={{ flex: 1, color: '#000', fontWeight: 600, fontSize: 14 }}>{document.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>الوصف (Description)</label>
                  <div style={{ flex: 1 }}>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      rows={3} style={{ width: '100%', maxWidth: 450, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, resize: 'vertical' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111' }}>انتهاء المستند (Expires)</label>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="date" value={expires} onChange={e => setExpires(e.target.value)}
                      style={{ border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, minWidth: 150 }} />
                    <button type="button" onClick={() => setExpires('')}
                      style={{ background: '#eee', border: '1px solid #ccc', padding: '3px 10px', fontSize: 11, cursor: 'pointer', borderRadius: 3 }}>
                      بلا انتهاء (Never)
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, paddingRight: 140 }}>
                  <input type="checkbox" checked={isSuspended} onChange={e => setIsSuspended(e.target.checked)} id="suspendDoc" style={{ marginLeft: 8 }} />
                  <label htmlFor="suspendDoc" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#d32f2f' }}>
                    تجميد المستند وإيقاف القراءة (Suspend Document)
                  </label>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
                <div style={{ display: 'flex', gap: 12, paddingRight: 140 }}>
                  <button type="button" onClick={handleSave} disabled={updateMutation.isPending}
                    style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: updateMutation.isPending ? 0.6 : 1 }}>
                    {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ (Save)'}
                  </button>
                  <button type="button" onClick={() => navigate('/documents')}
                    style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 2, padding: '8px 30px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    إلغاء (Cancel)
                  </button>
                </div>
              </div>

              {/* معلومات النظام */}
              <div style={{ marginTop: 40, padding: '16px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 3, fontSize: 13, maxWidth: 800 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, color: TEAL }}>معلومات النظام (System Details):</h4>
                <table style={{ lineHeight: 1.8 }}>
                  <tbody>
                    <tr>
                      <td style={flStyle}>معرف المستند (ID):</td>
                      <td style={{ color: '#000' }}>{document.id}</td>
                    </tr>
                    <tr>
                      <td style={flStyle}>تاريخ النشر (Published):</td>
                      <td style={{ color: '#000' }}>{document.published}</td>
                    </tr>
                    <tr>
                      <td style={flStyle}>المسجلين (Registered):</td>
                      <td style={{ color: '#000' }}>
                        {document.customers_count ?? 0} عميل مُصرح، و {document.publications_count ?? 0} منشور مرتبط.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تبويبة 2: إعدادات الأمان */}
          {activeTab === 'drm' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                إعدادات حماية المستند (Security Settings - Read Only)
              </div>
              <div style={{ maxWidth: 800 }}>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 20, fontStyle: 'italic' }}>
                  هذه الخصائص تم تحديدها من طرف الناشر ولا يمكن تعديلها من لوحة الإدارة.
                </p>
                <table style={{ fontSize: 13, lineHeight: '2.4', width: '100%', maxWidth: 500 }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600, width: '60%', borderBottom: '1px solid #eee' }}>نمط انتهاء الصلاحية (Expiry Mode)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.expiry_mode ?? '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>نمط التحقق (Verify Mode)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.verify_mode ?? '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>الحد الأقصى للمشاهدات (Max Views Allowed)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.max_views_allowed ?? 'غير محدود'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>تاريخ انتهاء الحماية (Security Expiry Date)</td>
                      <td>{document.security?.expiry_date ?? '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تبويبة 3: وصول العملاء — حقيقية من API */}
          {activeTab === 'access' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                وصول العملاء والمنشورات المدمجة (Access & Distribution)
              </div>

              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.9, marginBottom: 20 }}>
                <p>عدد العملاء المصرح لهم: <strong>{document.customers_count ?? 0}</strong></p>
                <p>عدد المنشورات المرتبطة: <strong>{document.publications_count ?? 0}</strong></p>
              </div>

              {accessLoading ? (
                <div style={{ color: TEAL, fontSize: 13, padding: '20px 0' }}>جاري تحميل قائمة الوصول...</div>
              ) : accessList.length > 0 ? (
                <table style={{ width: '100%', maxWidth: 600, fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '2px solid #ddd', fontWeight: 700 }}>اسم العميل</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '2px solid #ddd', fontWeight: 700 }}>البريد الإلكتروني</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '2px solid #ddd', fontWeight: 700 }}>تاريخ المنح</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessList.map((item, i) => (
                      <tr key={item.id ?? i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px 12px' }}>{item.name ?? item.customer_name ?? '—'}</td>
                        <td style={{ padding: '8px 12px' }}>{item.email ?? '—'}</td>
                        <td style={{ padding: '8px 12px' }}>{item.granted_at ?? item.created_at ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>
                  لا يوجد عملاء مصرح لهم بالوصول لهذا المستند.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const flStyle = { fontWeight: 700, paddingLeft: 24, paddingRight: 8, color: '#555', width: 180 }

export default DocumentDetailPage
