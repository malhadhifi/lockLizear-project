/**
 * ملف: DocumentDetailPage.jsx
 * الوظيفة: تفاصيل وإعدادات المستند — مع تبويبة DRM Settings كاملة
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
  const [activeTab, setActiveTab] = useState(initialTab)

  // ── تبويبة details ───────────────────────────────────────────────
  const [note,        setNote]        = useState('')
  const [expiryDate,  setExpiryDate]  = useState('')
  const [isSuspended, setIsSuspended] = useState(false)

  // ── تبويبة DRM ───────────────────────────────────────────────────
  const [expiryMode,           setExpiryMode]           = useState('none')
  const [expiryDays,           setExpiryDays]           = useState('')
  const [verifyMode,           setVerifyMode]           = useState('none')
  const [verifyFrequencyDays,  setVerifyFrequencyDays]  = useState('')
  const [gracePeriodDays,      setGracePeriodDays]      = useState('')
  const [maxViewsAllowed,      setMaxViewsAllowed]      = useState('')

  // ── React Query ──────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useDocumentDetail(idParam)

  // الباك إند: { data: { id, title, ... } }
  const document = data?.data ?? data ?? null

  const updateMutation = useUpdateDocument()

  const {
    data: accessData,
    isLoading: accessLoading,
  } = useDocumentAccessList(activeTab === 'access' ? idParam : null)

  const accessList = Array.isArray(accessData?.data)
    ? accessData.data
    : Array.isArray(accessData)
      ? accessData
      : []

  // ── مزامنة State مع البيانات ─────────────────────────────────────
  useEffect(() => {
    if (!document) return
    setNote(document.description || '')
    setIsSuspended(document.status === 'suspended')

    const sc = document.security_controls ?? document.securityControls ?? {}
    setExpiryMode(sc.expiry_mode || 'none')
    setExpiryDate(sc.expiry_date ? sc.expiry_date.slice(0, 10) : '')
    setExpiryDays(sc.expiry_days ?? '')
    setVerifyMode(sc.verify_mode || 'none')
    setVerifyFrequencyDays(sc.verify_frequency_days ?? '')
    setGracePeriodDays(sc.grace_period_days ?? '')
    setMaxViewsAllowed(sc.max_views_allowed ?? '')
  }, [document])

  // ── Loading / Error ──────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
      <div style={{ color: TEAL, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>جاري تحميل تفاصيل المستند...</div>
      <div style={{ width: 36, height: 36, border: `4px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (isError) return (
    <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
      <p style={{ color: '#d32f2f', fontSize: 16, marginBottom: 20 }}>⚠️ {error?.message || 'حدث خطأ في جلب البيانات'}</p>
      <button onClick={() => refetch()} style={btnStyle(TEAL)}>إعادة المحاولة</button>
      <button onClick={() => navigate('/documents')} style={btnStyle('#f0f0f0', '#333', '1px solid #ccc')}>العودة للقائمة</button>
    </div>
  )

  if (!document) return (
    <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
      <p style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>المستند غير موجود</p>
      <button onClick={() => navigate('/documents')} style={btnStyle(TEAL)}>العودة للقائمة</button>
    </div>
  )

  // ── حفظ تبويبة التفاصيل ─────────────────────────────────────────
  const handleSaveDetails = async () => {
    try {
      await updateMutation.mutateAsync({
        id: document.id,
        data: {
          note,                                         // ✅ الحقل الصحيح في الباك إند
          ...(expiryDate && { expiry_date: expiryDate }),  // ✅ الحقل الصحيح
        },
      })
      toast.success('تم تحديث تفاصيل المستند بنجاح!')
    } catch {}
  }

  // ── حفظ تبويبة DRM ──────────────────────────────────────────────
  const handleSaveDRM = async () => {
    const payload = {
      expiry_mode:          expiryMode,
      ...(expiryMode === 'fixed_date'            && expiryDate  && { expiry_date:           expiryDate }),
      ...(expiryMode === 'days_from_first_use'   && expiryDays  && { expiry_days:           Number(expiryDays) }),
      verify_mode:          verifyMode,
      ...(verifyMode === 'periodic'              && verifyFrequencyDays && { verify_frequency_days: Number(verifyFrequencyDays) }),
      ...(gracePeriodDays !== ''                 && { grace_period_days: Number(gracePeriodDays) }),
      ...(maxViewsAllowed !== ''                 && { max_views_allowed: Number(maxViewsAllowed) }),
    }
    try {
      await updateMutation.mutateAsync({ id: document.id, data: payload })
      toast.success('تم حفظ إعدادات الحماية بنجاح!')
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
        <div style={{ background: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>إدارة المستند: {document.title}</span>
          <button type="button" onClick={() => navigate('/documents')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>← العودة للقائمة</button>
        </div>

        {/* التبويبات */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${TEAL}`, background: '#f5f5f5' }}>
          {tabs.map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              style={{ padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeTab === tab.key ? TEAL : 'transparent', color: activeTab === tab.key ? '#fff' : '#555' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>

          {/* ═══════════════════════════════════════════════════════════════
              تبويبة التفاصيل
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'details' && (
            <div style={{ maxWidth: 600 }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <DataRow label="العنوان (Title)"         value={document.title} />
                  <DataRow label="المعرف (ID)"             value={document.id} />
                  <DataRow label="تاريخ النشر (Published)" value={document.published} />
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>الوصف / الملاحظة (Note)</td>
                    <td style={{ padding: '10px 0' }}>
                      <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
                        style={{ width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '6px 8px', fontSize: 13, resize: 'vertical' }} />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>تاريخ الانتهاء (Expiry Date)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                        style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
                      {expiryDate && (
                        <button type="button" onClick={() => setExpiryDate('')}
                          style={{ marginRight: 8, background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: 12 }}>
                          ✕ مسح التاريخ
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 20 }}>
                <button type="button" onClick={handleSaveDetails} disabled={updateMutation.isPending} style={btnStyle(TEAL, '#fff', 'none', updateMutation.isPending)}>
                  {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات (Save)'}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              تبويبة DRM Settings
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'drm' && (
            <div style={{ maxWidth: 640, fontSize: 13 }}>

              {/* قسم انتهاء الصلاحية */}
              <SectionTitle>1. إعدادات انتهاء الصلاحية (Expiry Mode)</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>طريقة الانتهاء (Expiry Mode)</td>
                    <td style={{ padding: '10px 0' }}>
                      <select value={expiryMode} onChange={e => setExpiryMode(e.target.value)} style={selectStyle}>
                        <option value="none">لا يوجد انتهاء (None)</option>
                        <option value="fixed_date">تاريخ محدد (Fixed Date)</option>
                        <option value="days_from_first_use">أيام من أول استخدام (Days from first use)</option>
                      </select>
                    </td>
                  </tr>
                  {expiryMode === 'fixed_date' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={labelTd}>تاريخ الانتهاء (Expiry Date)</td>
                      <td style={{ padding: '10px 0' }}>
                        <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                          style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
                      </td>
                    </tr>
                  )}
                  {expiryMode === 'days_from_first_use' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={labelTd}>عدد الأيام (Days)</td>
                      <td style={{ padding: '10px 0' }}>
                        <input type="number" min={1} value={expiryDays} onChange={e => setExpiryDays(e.target.value)}
                          placeholder="مثال: 30" style={inputStyle} />
                        <span style={{ marginRight: 8, color: '#888' }}>يوماً من أول فتح</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* قسم التحقق */}
              <SectionTitle>2. إعدادات التحقق (Verify Mode)</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>طريقة التحقق (Verify Mode)</td>
                    <td style={{ padding: '10px 0' }}>
                      <select value={verifyMode} onChange={e => setVerifyMode(e.target.value)} style={selectStyle}>
                        <option value="none">لا يوجد تحقق (None)</option>
                        <option value="periodic">دوري (Periodic)</option>
                        <option value="on_every_open">عند كل فتح (On Every Open)</option>
                      </select>
                    </td>
                  </tr>
                  {verifyMode === 'periodic' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={labelTd}>تكرار التحقق (Frequency)</td>
                      <td style={{ padding: '10px 0' }}>
                        <input type="number" min={1} value={verifyFrequencyDays} onChange={e => setVerifyFrequencyDays(e.target.value)}
                          placeholder="مثال: 7" style={inputStyle} />
                        <span style={{ marginRight: 8, color: '#888' }}>يوم بين كل تحقق</span>
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>فترة السماح (Grace Period)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="number" min={0} value={gracePeriodDays} onChange={e => setGracePeriodDays(e.target.value)}
                        placeholder="0" style={inputStyle} />
                      <span style={{ marginRight: 8, color: '#888' }}>يوم (0 = لا فترة سماح)</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* قسم المشاهدات */}
              <SectionTitle>3. حد المشاهدات (Max Views)</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={labelTd}>الحد الأقصى للمشاهدات</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="number" min={0} value={maxViewsAllowed} onChange={e => setMaxViewsAllowed(e.target.value)}
                        placeholder="0 = غير محدود" style={inputStyle} />
                      <span style={{ marginRight: 8, color: '#888' }}>مشاهدة (0 = غير محدود)</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button type="button" onClick={handleSaveDRM} disabled={updateMutation.isPending} style={btnStyle(TEAL, '#fff', 'none', updateMutation.isPending)}>
                {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ إعدادات الحماية (Save DRM)'}
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              تبويبة قائمة الوصول
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'access' && (
            <div>
              {accessLoading ? (
                <div style={{ textAlign: 'center', padding: 30, color: TEAL }}>جاري تحميل قائمة الوصول...</div>
              ) : accessList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: '#888' }}>لا يوجد عملاء مصرح لهم بالوصول لهذا المستند</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: TEAL, color: '#fff' }}>
                      {['المعرف', 'الاسم', 'البريد الإلكتروني', 'الشركة', 'طريقة الوصول', 'صلاحي حتى'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accessList.map((customer, i) => (
                      <tr key={customer.id ?? i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <td style={tdStyle}>{customer.id}</td>
                        <td style={tdStyle}>{customer.name}</td>
                        <td style={tdStyle}>{customer.email}</td>
                        <td style={tdStyle}>{customer.company ?? '—'}</td>
                        <td style={tdStyle}>
                          <span style={{ background: customer.access_mode === 'read' ? '#e3f2fd' : '#f3e5f5', color: customer.access_mode === 'read' ? '#1565c0' : '#6a1b9a', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>
                            {customer.access_mode ?? '—'}
                          </span>
                        </td>
                        <td style={tdStyle}>{customer.expires_at ?? '—'}</td>
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

// ─── مكونات مساعدة ────────────────────────────────────────────────────────────
const DataRow = ({ label, value }) => (
  <tr style={{ borderBottom: '1px solid #eee' }}>
    <td style={labelTd}>{label}</td>
    <td style={{ padding: '10px 0', color: '#333' }}>{value ?? '—'}</td>
  </tr>
)

const SectionTitle = ({ children }) => (
  <div style={{ fontWeight: 700, fontSize: 13, color: TEAL, borderBottom: `2px solid ${TEAL}`, paddingBottom: 6, marginBottom: 12 }}>
    {children}
  </div>
)

const btnStyle = (bg, color = '#fff', border = 'none', disabled = false) => ({
  background: bg, color, border, borderRadius: 3,
  padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1, marginLeft: 10,
})

const labelTd   = { fontWeight: 700, padding: '10px 16px', width: 200, color: '#111', verticalAlign: 'top', paddingTop: 14 }
const tdStyle   = { padding: '8px 12px' }
const selectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13, minWidth: 220 }
const inputStyle  = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13, width: 100 }

export default DocumentDetailPage
