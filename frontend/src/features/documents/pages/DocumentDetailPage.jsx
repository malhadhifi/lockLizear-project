import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDocumentDetail, useUpdateDocument, useDocumentAccessList } from '../hooks/useDocuments'
import { userApi } from '../../users/services/userApi'
import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/axios'

const TEAL = '#008b9c'
const LINK_COLOR = '#337ab7'

/* ═══════════════════════════════════════════════════════
   مكون نافذة منبثقة عامة باللغة العربية
   ═══════════════════════════════════════════════════════ */
const Modal = ({ open, onClose, title, icon, children, width = 720 }) => {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 9999, paddingTop: '5vh', padding: '5vh 10px 10px 10px', direction: 'rtl' }}
      onClick={onClose}>
      <div style={{ background: '#fff', width: '100%', maxWidth: width, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: `1px solid ${TEAL}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ background: TEAL, color: '#fff', padding: '6px 12px', fontWeight: 600, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             {icon && <i className={`bi ${icon}`} style={{ fontSize: 14 }} />}
             <span>{title}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', padding: 0 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   1. عرض العملاء الذين لديهم إمكانية الوصول
   ═══════════════════════════════════════════════════════ */
const ViewCustomersModal = ({ open, onClose, docId, accessList }) => {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showAtLeast, setShowAtLeast] = useState(25)

  const rows = useMemo(() => {
    let list = [...accessList]
    if (filter) {
      const s = filter.toLowerCase()
      list = list.filter(c => (c.name || '').toLowerCase().includes(s) || (c.email || '').toLowerCase().includes(s))
    }
    list.sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id
      return (a.name || '').localeCompare(b.name || '')
    })
    return list.slice(0, showAtLeast)
  }, [accessList, filter, sortBy, showAtLeast])

  return (
    <Modal open={open} onClose={onClose} title={`العملاء الذين لديهم وصول للمستند المعرف: ${docId}`} icon="bi-people-fill" width={780}>
      <div style={{ padding: 16 }}>
        {/* التصفية */}
        <div className="mobile-filter-row" style={{ border: '1px solid #ccc', padding: 12, marginBottom: 16, background: '#fcfcfc', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', fontSize: 13 }}>
          <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 280 }}>
            <label style={{ width: 80, color: '#333' }}>تصفية (Filter)</label>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '100%', padding: '4px 28px 4px 8px', border: '1px solid #ccc', borderRadius: 2 }} />
              <i className="bi bi-search" style={{ position: 'absolute', right: 8, top: 6, color: '#888' }} />
            </div>
          </div>
          
          <div style={{ width: '100%', height: 0 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#333' }}>فرز حسب (Sort by)</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', width: 90 }}>
              <option value="name">الاسم</option>
              <option value="id">المعرف</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#333' }}>عرض على الأقل</label>
            <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={{ padding: '4px', border: '1px solid #ccc', width: 60 }}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* أزرار */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, marginBottom: 16 }}>
          <button style={{ background: '#337ab7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 2, fontSize: 13, cursor: 'pointer' }}>تصدير CSV Export</button>
          <button onClick={onClose} style={{ background: TEAL, color: '#fff', border: 'none', padding: '6px 20px', borderRadius: 2, fontSize: 13, cursor: 'pointer' }}>موافق OK</button>
        </div>

        {/* الجدول */}
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, borderTop: '1px solid #ddd', minWidth: 500 }}>
          <thead>
            <tr style={{ background: '#fff', borderBottom: '2px solid #ddd', color: '#333' }}>
              <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>المعرف (ID)</th>
              <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>الاسم (Name)</th>
              <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>البريد (Email)</th>
              <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>الشركة (Company)</th>
              <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>الوصول (Access)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{r.id}</td>
                <td style={{ padding: '8px' }}>{r.name}</td>
                <td style={{ padding: '8px' }}>{r.email}</td>
                <td style={{ padding: '8px' }}>{r.company || '—'}</td>
                <td style={{ padding: '8px', color: '#28a745', fontWeight: 'bold' }}>
                  نعم، {r.access_mode === 'baselimited' ? 'محدود' : 'غير محدود'}.
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#888' }}>لا يوجد عملاء.</td></tr>
            )}
          </tbody>
        </table>
        </div>
        
        {/* زر التصدير السفلي */}
        <div style={{ marginTop: 16 }}>
          <button style={{ background: '#337ab7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 2, fontSize: 13, cursor: 'pointer' }}>تصدير CSV Export</button>
        </div>
      </div>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════
   2. منح أو سحب حق الوصول
   ═══════════════════════════════════════════════════════ */
const GrantRevokeModal = ({ open, onClose, docId, allCustomers, accessList, onBulkAction }) => {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showAtLeast, setShowAtLeast] = useState(35)
  const [custFilter, setCustFilter] = useState('All')
  
  const [selected, setSelected] = useState([])
  const [action, setAction] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [untilDate, setUntilDate] = useState('')

  const merged = useMemo(() => {
    return allCustomers.map(c => {
      const acc = accessList.find(a => a.id === c.id)
      return {
        ...c,
        has_access: !!acc,
        is_valid: c.status === 'valid' || c.status === 'active' || c.status === 'enabled',
      }
    })
  }, [allCustomers, accessList])

  const filtered = useMemo(() => {
    let list = [...merged]
    if (filter) {
      const s = filter.toLowerCase()
      list = list.filter(c => (c.name || '').toLowerCase().includes(s) || (c.email || '').toLowerCase().includes(s))
    }
    if (custFilter === 'with_access') list = list.filter(c => c.has_access)
    else if (custFilter === 'without_access') list = list.filter(c => !c.has_access)

    list.sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id
      return (a.name || '').localeCompare(b.name || '')
    })
    return list.slice(0, showAtLeast)
  }, [merged, filter, sortBy, showAtLeast, custFilter])

  const handleAction = async () => {
    if (!action || selected.length === 0) return
    await onBulkAction(selected, action, fromDate, untilDate)
    setSelected([])
    setAction('')
  }

  return (
    <Modal open={open} onClose={onClose} title="تحديد وصول المستند (Set Document Access)" icon="bi-person-plus-fill" width={850}>
      <div style={{ padding: 16 }}>
        {/* صندوق التحكم العلوي */}
        <div style={{ border: `1px solid ${TEAL}`, padding: 16, marginBottom: 16, fontSize: 13 }}>
          <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <label style={{ width: 80, color: '#333' }}>تصفية (Filter)</label>
            <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '100%', padding: '4px 28px 4px 8px', border: '1px solid #ccc', borderRadius: 2 }} />
              <i className="bi bi-search" style={{ position: 'absolute', right: 8, top: 6, color: '#888' }} />
            </div>
          </div>

          <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <label style={{ color: '#333' }}>فرز حسب (Sort by)</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', width: 100 }}>
              <option value="name">الاسم</option>
              <option value="id">المعرف</option>
            </select>

            <label style={{ color: '#333', marginRight: 16 }}>عرض على الأقل</label>
            <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={{ padding: '4px', border: '1px solid #ccc', width: 60 }}>
              <option value={35}>35</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <label style={{ color: '#333', marginRight: 16 }}>العملاء (Customers)</label>
            <select value={custFilter} onChange={e => setCustFilter(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', width: 120 }}>
              <option value="All">الكل</option>
              <option value="with_access">لديهم وصول</option>
              <option value="without_access">ليس لديهم وصول</option>
            </select>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #ddd', margin: '16px 0' }} />

          <div className="mobile-check-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ color: '#333' }}>الكل</span>
            <a href="#" onClick={e => { e.preventDefault(); setSelected(filtered.map(x => x.id)) }} style={{ color: LINK_COLOR, textDecoration: 'underline' }}>تحديد (Check)</a>
            <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); setSelected([]) }} style={{ color: LINK_COLOR, textDecoration: 'underline' }}>إلغاء (Uncheck)</a>
            <span style={{ color: '#ccc' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); setSelected(filtered.map(x => x.id).filter(id => !selected.includes(id))) }} style={{ color: LINK_COLOR, textDecoration: 'underline' }}>عكس (Invert)</a>
          </div>

          <div className="mobile-bulk-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', flex: 1 }}>
              <label style={{ color: '#333', marginTop: 6, fontWeight: 'bold' }}>مع كل المحدد (With all checked)</label>
              <div>
                <select value={action} onChange={e => setAction(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', width: '100%', maxWidth: 220, marginBottom: action === 'grant_limited' ? 8 : 0 }}>
                  <option value="">—</option>
                  <option value="grant_unlimited">منح وصول غير محدود</option>
                  <option value="grant_limited">منح وصول محدود</option>
                  <option value="revoke">سحب الوصول</option>
                </select>
                
                {action === 'grant_limited' && (
                  <div style={{ border: '1px solid #ccc', padding: 8, background: '#f9f9f9', marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <label style={{ width: 45 }}>من:</label>
                      <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ padding: 2, border: '1px solid #ccc', flex: 1 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label style={{ width: 45 }}>إلى:</label>
                      <input type="date" value={untilDate} onChange={e => setUntilDate(e.target.value)} style={{ padding: 2, border: '1px solid #ccc', flex: 1 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={handleAction} disabled={!action || selected.length === 0} style={{ background: '#337ab7', color: '#fff', border: 'none', padding: '6px 24px', borderRadius: 2, fontSize: 13, cursor: (!action || selected.length === 0) ? 'not-allowed' : 'pointer', alignSelf: 'flex-end', opacity: (!action || selected.length === 0) ? 0.6 : 1, fontWeight: 'bold' }}>
              موافق OK
            </button>
          </div>
        </div>

        {/* قائمة العملاء */}
        <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingLeft: 8 }}>
          {filtered.map(cust => {
            const isSel = selected.includes(cust.id)
            const sideColor = cust.has_access ? '#28a745' : '#dc3545'

            return (
              <div key={cust.id} style={{ display: 'flex', marginBottom: 8, border: '1px solid #ddd', background: '#fff' }}>
                <div style={{ width: 8, background: sideColor }}></div>
                <div style={{ padding: '0', flex: 1 }}>
                  <div style={{ background: '#f0f0f0', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={isSel} onChange={() => setSelected(s => s.includes(cust.id) ? s.filter(id => id !== cust.id) : [...s, cust.id])} style={{ margin: 0 }} />
                    <span style={{ fontWeight: 'bold', color: sideColor, fontSize: 13 }}>{cust.name || 'غير معروف'}</span>
                  </div>
                  <table style={{ fontSize: 12, lineHeight: 1.6, width: '100%', padding: '8px 12px', display: 'block' }}>
                    <tbody>
                      <tr><td style={{ width: 100, fontWeight: 'bold' }}>الشركة:</td><td>{cust.company || '—'}</td></tr>
                      <tr><td style={{ fontWeight: 'bold' }}>البريد:</td><td><a href={`mailto:${cust.email}`} style={{ color: LINK_COLOR, textDecoration: 'underline' }}>{cust.email}</a></td></tr>
                      <tr><td style={{ fontWeight: 'bold' }}>المعرف:</td><td>{cust.id}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', verticalAlign: 'top' }}>الحالة:</td><td>
                        <div style={{ color: cust.status === 'valid' || cust.status === 'enabled' ? '#337ab7' : '#dc3545' }}>{cust.status === 'valid' || cust.status === 'enabled' ? 'مفعل (enabled)' : 'غير مسجل'}</div>
                        {cust.is_valid ? <div style={{ color: '#28a745' }}>صالح مسجل منذ {cust.created_at?.slice(0, 10)}</div> : <div style={{ color: '#dc3545' }}>موقوف أو منتهي</div>}
                      </td></tr>
                      <tr><td style={{ fontWeight: 'bold' }}>الوصول:</td><td style={{ color: cust.has_access ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>{cust.has_access ? 'نعم (yes)' : 'لا (no)'}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>لا يوجد عملاء مطابقين.</div>}
        </div>
      </div>
    </Modal>
  )
}



/* ═══════════════════════════════════════════════════════
   المكون الرئيسي — DocumentDetailPage مع التبويبات الثلاثة
   ═══════════════════════════════════════════════════════ */
const DocumentDetailPage = () => {
  const idParam = parseInt(useParams().id, 10)
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('details')
  const [note, setNote] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  // للحماية DRM
  const [expiryMode, setExpiryMode] = useState('none')
  const [expiryDays, setExpiryDays] = useState('')
  const [verifyMode, setVerifyMode] = useState('none')
  const [verifyFrequencyDays, setVerifyFrequencyDays] = useState('')
  const [gracePeriodDays, setGracePeriodDays] = useState('')
  const [maxViewsAllowed, setMaxViewsAllowed] = useState('')
  const [printMode, setPrintMode] = useState('disabled')
  const [maxPrintsAllowed, setMaxPrintsAllowed] = useState('')
  const [logViews, setLogViews] = useState(false)
  const [logPrints, setLogPrints] = useState(false)

  // Modals state
  const [showCustomersModal, setShowCustomersModal] = useState(false)
  const [showGrantModal, setShowGrantModal] = useState(false)

  const { data, isLoading, refetch } = useDocumentDetail(idParam)
  const document = data?.data ?? data ?? null
  const updateMutation = useUpdateDocument()

  const { data: accessData, refetch: refetchAccess } = useDocumentAccessList(idParam)
  const accessList = Array.isArray(accessData?.data) ? accessData.data : Array.isArray(accessData) ? accessData : []
  
  // جلب العملاء باستخدام التخزين المؤقت وتحديد العدد لـ 50 لمنع التعليق
  const { data: allCustRes } = useQuery({
    queryKey: ['all-customers'],
    queryFn: () => userApi.fetchCustomers({ limit: 50 })
  });
  
  const allCustomers = useMemo(() => {
    const res = allCustRes;
    return res?.data?.items ?? res?.items ?? (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
  }, [allCustRes]);

  useEffect(() => {
    if (!document) return
    setNote(document.note || document.description || '')
    // الباك إند يعيد الحقول تحت مفتاح 'security'
    const sc = document.security || document.security_controls || {}
    
    // إعدادات الانتهاء
    const em = sc.expiry_mode || 'never'
    if (em === 'fixed_date') { setExpiryMode('fixed_date'); setExpiryDate(sc.expiry_date ? sc.expiry_date.slice(0, 10) : '') }
    else if (em === 'days_from_first_use') { setExpiryMode('days_from_first_use'); setExpiryDays(String(sc.expiry_days || '')) }
    else setExpiryMode('none')

    // إعدادات التحقق
    const vm = sc.verify_mode || 'never'
    if (vm !== 'never') { setVerifyMode('periodic'); setVerifyFrequencyDays(String(sc.verify_frequency_days || '')) }
    else setVerifyMode('none')

    setGracePeriodDays(sc.grace_period_days != null ? String(sc.grace_period_days) : '')
    setMaxViewsAllowed(sc.max_views_allowed != null ? String(sc.max_views_allowed) : '')
    
    // إعدادات الطباعة
    if (sc.print_mode) { setPrintMode(sc.print_mode) }
    else if (sc.max_prints_allowed > 0) { setPrintMode('limited'); setMaxPrintsAllowed(String(sc.max_prints_allowed)) }
    else { setPrintMode('disabled') }
    
    if (sc.max_prints_allowed != null) setMaxPrintsAllowed(String(sc.max_prints_allowed))

    setLogViews(!!sc.log_views)
    setLogPrints(!!sc.log_prints)
  }, [document])

  const handleSaveDetails = async () => {
    try {
      await updateMutation.mutateAsync({ id: document.id, data: { note: note, ...(expiryDate && { expiry_date: expiryDate }) } })
      toast.success('تم حفظ بيانات المستند بنجاح!')
    } catch {}
  }

  const handleSaveDRM = async () => {
    const p = {
      expiry_mode: expiryMode,
      ...(expiryMode === 'fixed_date' && expiryDate && { expiry_date: expiryDate }),
      ...(expiryMode === 'days_from_first_use' && expiryDays && { expiry_days: Number(expiryDays) }),
      verify_mode: verifyMode,
      ...(verifyMode === 'periodic' && verifyFrequencyDays && { verify_frequency_days: Number(verifyFrequencyDays) }),
      ...(gracePeriodDays !== '' && { grace_period_days: Number(gracePeriodDays) }),
      ...(maxViewsAllowed !== '' && { max_views_allowed: Number(maxViewsAllowed) }),
      print_mode: printMode,
      ...(printMode === 'limited' && maxPrintsAllowed && { max_prints_allowed: Number(maxPrintsAllowed) }),
      log_views: logViews,
      log_prints: logPrints,
    }
    try {
      await updateMutation.mutateAsync({ id: document.id, data: p })
      toast.success('تم حفظ إعدادات الحماية بنجاح!')
    } catch {}
  }

  const handleBulkAccess = async (selectedIds, actionStr, fromDt, untilDt) => {
    // actionStr is one of: 'revoke', 'grant_unlimited', 'grant_limited'
    let backendAction = 'revoke'
    if (actionStr === 'grant_unlimited') backendAction = 'unlimited'
    if (actionStr === 'grant_limited') backendAction = 'baselimited'

    try {
      const promises = selectedIds.map(custId => {
        const payload = {
          document_ids: [idParam],
          action: backendAction,
          ...(fromDt && { valid_from: fromDt }),
          ...(untilDt && { valid_until: untilDt }),
        }
        return api.post(`/customer-management/customer-licenses/${custId}/documents/bulk-access`, payload)
      })
      await Promise.all(promises)
      toast.success(backendAction === 'revoke' ? `تم سحب الوصول من ${selectedIds.length} عميل` : `تم منح الوصول لـ ${selectedIds.length} عميل`)
      refetchAccess()
      setShowGrantModal(false)
    } catch {
      toast.error('حدث خطأ أثناء تنفيذ العملية')
    }
  }

  if (isLoading || !document) return <div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>

  return (
    <div className="main-content-area" style={{ padding: '20px 40px', background: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl' }}>
      
      <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 4, minHeight: 600 }}>
        {/* الترويسة الرئيسية */}
        <div style={{ background: TEAL, color: '#fff', padding: '10px 16px', fontWeight: 'bold', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>إدارة المستند: {document.title}</span>
          <button onClick={() => navigate('/documents')} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 2, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>← العودة للقائمة</button>
        </div>

        {/* التبويبات */}
        <div className="mobile-nav-bar" style={{ display: 'flex', background: '#f0f0f0', borderBottom: `2px solid ${TEAL}`, flexWrap: 'wrap' }}>
          {[
            { id: 'details', lbl: 'تعديل المستند (Edit Document)' },
            { id: 'drm', lbl: 'إعدادات الحماية (Security Settings)' },
            { id: 'access', lbl: `العملاء/الوصول (${accessList.length})` }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? TEAL : 'transparent',
              color: activeTab === t.id ? '#fff' : '#555',
              border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer', flex: '1 1 auto', minWidth: 0
            }}>
              {t.lbl}
            </button>
          ))}
        </div>

        {/* محتوى التبويبات */}
        <div style={{ padding: 24, fontSize: 13 }}>
          
          {/* Details */}
          <div style={{ display: activeTab === 'details' ? 'block' : 'none', maxWidth: 600, width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', width: 200, color: '#333' }}>العنوان (Title)</td><td style={{ padding: '10px 0' }}>{document.title}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>المعرف (ID)</td><td style={{ padding: '10px 0' }}>{document.id}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>تاريخ النشر (Published)</td><td style={{ padding: '10px 0' }}>{document.published || document.created_at?.slice(0, 10)}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>تاريخ الانتهاء</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2 }} />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', verticalAlign: 'top', color: '#333' }}>ملاحظات (Note)</td>
                    <td style={{ padding: '10px 0' }}>
                      <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 2 }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 20 }}>
                <button onClick={handleSaveDetails} disabled={updateMutation.isPending} style={{ background: TEAL, color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 2, fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>
                  حفظ (Save)
                </button>
              </div>
            </div>

          {/* DRM Settings */}
          <div style={{ display: activeTab === 'drm' ? 'block' : 'none', maxWidth: 600, width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', width: 220, color: '#333' }}>طريقة الانتهاء (Expiry Mode)</td>
                    <td style={{ padding: '10px 0' }}>
                      <select value={expiryMode} onChange={e => setExpiryMode(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2, width: 200 }}>
                        <option value="none">لا يوجد (None)</option>
                        <option value="fixed_date">تاريخ محدد (Fixed Date)</option>
                        <option value="days_from_first_use">أيام من أول استخدام</option>
                      </select>
                    </td>
                  </tr>
                  {expiryMode === 'fixed_date' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>التاريخ (Date)</td>
                      <td style={{ padding: '10px 0' }}><input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2 }} /></td>
                    </tr>
                  )}
                  {expiryMode === 'days_from_first_use' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>عدد الأيام (Days)</td>
                      <td style={{ padding: '10px 0' }}><input type="number" value={expiryDays} onChange={e => setExpiryDays(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2, width: 80 }} /> يوم</td>
                    </tr>
                  )}
                  
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>الطباعة (Printing)</td>
                    <td style={{ padding: '10px 0' }}>
                      <select value={printMode} onChange={e => setPrintMode(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2, width: 200 }}>
                        <option value="disabled">معطلة (Disabled)</option>
                        <option value="unlimited">غير محدد (Unlimited)</option>
                        <option value="limited">محدود (Limited)</option>
                      </select>
                    </td>
                  </tr>
                  {printMode === 'limited' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>عدد النسخ المسموحة</td>
                      <td style={{ padding: '10px 0' }}><input type="number" value={maxPrintsAllowed} onChange={e => setMaxPrintsAllowed(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2, width: 80 }} /></td>
                    </tr>
                  )}
                  
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>عدد المشاهدات القصوى (Max Views)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="number" value={maxViewsAllowed} onChange={e => setMaxViewsAllowed(e.target.value)} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 2, width: 120 }} placeholder="غير محدد" />
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>سجل الفتح (Log Opens)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="checkbox" checked={logViews} onChange={e => setLogViews(e.target.checked)} /> نعم
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#333' }}>سجل الطباعة (Log Prints)</td>
                    <td style={{ padding: '10px 0' }}>
                      <input type="checkbox" checked={logPrints} onChange={e => setLogPrints(e.target.checked)} /> نعم
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 20 }}>
                <button onClick={handleSaveDRM} disabled={updateMutation.isPending} style={{ background: TEAL, color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 2, fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>
                  حفظ إعدادات الحماية (Save DRM)
                </button>
              </div>
            </div>

          {/* Access / Operations */}
          <div style={{ display: activeTab === 'access' ? 'block' : 'none' }}>
              <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>استخدم الروابط أدناه لإدارة صلاحيات الوصول وعرض السجلات:</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); setShowCustomersModal(true) }} style={{ color: LINK_COLOR, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 'bold' }}>
                    <i className="bi bi-people-fill" style={{ fontSize: 18, color: '#333' }} /> 
                    عرض العملاء الذين لديهم إمكانية الوصول
                  </a>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); setShowGrantModal(true) }} style={{ color: LINK_COLOR, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 'bold' }}>
                    <i className="bi bi-person-plus-fill" style={{ fontSize: 18, color: '#333' }} /> 
                    منح أو سحب حق الوصول
                  </a>
                </li>

              </ul>
        </div>
      </div>
      </div>

      {/* النوافذ المنبثقة */}
      <ViewCustomersModal open={showCustomersModal} onClose={() => setShowCustomersModal(false)} docId={document.id} accessList={accessList} />
      <GrantRevokeModal open={showGrantModal} onClose={() => setShowGrantModal(false)} docId={document.id} allCustomers={allCustomers} accessList={accessList} onBulkAction={handleBulkAccess} />
      


    </div>
  )
}

export default DocumentDetailPage
