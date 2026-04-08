import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { usePublicationSubscribers, useRevokeSubscriberAccess } from '../hooks/usePublications'
import { useUpdatePublicationAccess } from '../../users/hooks/useUsers'
import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/axios'

const TEAL = '#009cad'

const PublicationAccessList = ({ publicationId }) => {
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showAtLeast, setShowAtLeast] = useState(25)
  const [showFilter, setShowFilter] = useState('with_access')
  const [bulkAction, setBulkAction] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [isLimited, setIsLimited] = useState(false)
  const [grantAll, setGrantAll] = useState(false)

  const { data: subsRes, isLoading } = usePublicationSubscribers(publicationId)
  const customers = Array.isArray(subsRes?.data) ? subsRes.data : Array.isArray(subsRes) ? subsRes : []
  
  // جلب كل العملاء من النظام بحد 50 مع تفعيل البحث في السيرفر لمنع ثقل المتصفح
  const { data: allCustomersRes } = useQuery({
    queryKey: ['all-customers-for-pub', publicationId, filter],
    queryFn: () => api.get('/customer-management/customer-licenses', { params: { limit: 50, search: filter } }),
  })
  const allCustomers = allCustomersRes?.data?.items || allCustomersRes?.items || []
  
  const revokeMutation = useRevokeSubscriberAccess()
  const pubAccessMutation = useUpdatePublicationAccess()


  // بناء القائمة النهائية بناءً على فلتر Show
  const displayList = useMemo(() => {
    const subscriberIds = customers.map(c => c.id)
    
    let list = []
    if (showFilter === 'all') {
      // دمج كل العملاء مع حالة الوصول
      list = allCustomers.map(c => {
        const sub = customers.find(s => s.id === c.id)
        return sub ? { ...sub, hasAccess: true } : { 
          id: c.id, name: c.name, company: c.company || '', email: c.email,
          status: c.ui_status?.account_status || 'not_registered',
          registered: c.ui_status?.registration || '—',
          expires: c.ui_status?.expired_on || '—',
          hasAccess: false, accessType: 'none'
        }
      })
    } else if (showFilter === 'with_access') {
      list = customers.map(c => ({ ...c, hasAccess: true }))
    } else if (showFilter === 'without_access') {
      list = allCustomers
        .filter(c => !subscriberIds.includes(c.id))
        .map(c => ({ 
          id: c.id, name: c.name, company: c.company || '', email: c.email,
          status: 'not_registered', registered: '—', expires: '—',
          hasAccess: false, accessType: 'none'
        }))
    } else if (showFilter === 'unlimited') {
      list = customers.filter(c => !c.valid_from && !c.valid_until).map(c => ({ ...c, hasAccess: true, accessType: 'unlimited' }))
    } else if (showFilter === 'limited') {
      list = customers.filter(c => c.valid_from || c.valid_until).map(c => ({ ...c, hasAccess: true, accessType: 'limited' }))
    }
    return list
  }, [customers, allCustomers, showFilter])

  // تصفية وفرز
  const filtered = useMemo(() => {
    let result = [...displayList]
    if (filter) {
      const s = filter.toLowerCase()
      result = result.filter(c => 
        (c.name || '').toLowerCase().includes(s) || 
        (c.email || '').toLowerCase().includes(s) || 
        (c.company || '').toLowerCase().includes(s)
      )
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '')
      if (sortBy === 'email') return (a.email || '').localeCompare(b.email || '')
      return 0
    })
    return result
  }, [displayList, filter, sortBy])

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const checkAll = () => setSelected(filtered.map(c => c.id))
  const uncheckAll = () => setSelected([])
  const invertSelection = () => setSelected(filtered.map(c => c.id).filter(id => !selected.includes(id)))

  // تنفيذ العمليات الجماعية
  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    
    if (bulkAction === 'revoke') {
      revokeMutation.mutate({ id: publicationId, customer_ids: selected }, {
        onSuccess: () => {
          toast.success(`تم سحب الوصول من ${selected.length} عميل بنجاح!`)
          setSelected([])
          setBulkAction('')
        }
      })
    } else if (bulkAction === 'grant_unlimited' || bulkAction === 'grant_limited') {
      // لكل عميل محدد، نستخدم endpoint العملاء لمنح الوصول
      const action = bulkAction === 'grant_unlimited' ? 'unlimited' : 'limited'
      const promises = selected.map(customerId => {
        const data = {
          action,
          publication_ids: [parseInt(publicationId)]
        }
        if (action === 'limited') {
          data.valid_from = validFrom
          data.valid_until = validUntil
        }
        return pubAccessMutation.mutateAsync({ customerId, data })
      })
      
      Promise.all(promises).then(() => {
        toast.success(`تم منح الوصول لـ ${selected.length} عميل بنجاح!`)
        setSelected([])
        setBulkAction('')
        setValidFrom('')
        setValidUntil('')
      }).catch(err => {
        toast.error('حدث خطأ أثناء منح الوصول!')
        console.error(err)
      })
    }
  }

  const statusLabel = (status) => {
    const map = {
      registered: { color: '#2e7d32', bg: '#e8f5e9', text: 'مسجل (Registered)' },
      suspended: { color: '#e65100', bg: '#fff3e0', text: 'موقوف (Suspended)' },
      expired: { color: '#c62828', bg: '#ffebee', text: 'منتهي (Expired)' },
      not_registered: { color: '#1565c0', bg: '#e3f2fd', text: 'غير مسجل (Not Registered)' },
    }
    const s = map[status] || map.not_registered
    return <span style={{ color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{s.text}</span>
  }

  return (
    <div>
      {/* شريط العنوان بلون TEAL */}
      <div style={{
        background: TEAL, color: '#fff', padding: '8px 16px',
        fontWeight: 700, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span>العملاء المصرح لهم (Customer Access) — {customers.length} عميل</span>
        <i className="bi bi-people-fill" />
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: 20, color: TEAL }}>جارٍ جلب عملاء المنشور... ⏳</div>}

      {/* الفلاتر */}
      <div style={{ padding: '16px 20px', background: '#fff', border: `1px solid ${TEAL}`, borderTop: 'none' }}>
        
        {/* سطر الفلتر النصي */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, fontSize: 13 }}>
          <span style={{ fontWeight: 700, minWidth: 50 }}>Filter</span>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
            <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="ابحث بالاسم أو الإيميل..."
              style={{ border: '1px solid #ccc', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28, padding: '0 8px', fontSize: 13 }} />
          </div>
        </div>

        {/* سطر الفرز والعرض */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, fontSize: 13, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontWeight: 700 }}>Sort by</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }}>
              <option value="name">الاسم (Name)</option>
              <option value="company">الشركة (Company)</option>
              <option value="email">البريد (Email)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontWeight: 700 }}>Show at least</label>
            <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))}
              style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontWeight: 700 }}>Show</label>
            <select value={showFilter} onChange={e => { setShowFilter(e.target.value); setSelected([]) }}
              style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }}>
              <option value="all">الكل (All)</option>
              <option value="with_access">مع وصول (With Access)</option>
              <option value="without_access">بدون وصول (Without Access)</option>
              <option value="unlimited">وصول دائم (With Unlimited Access)</option>
              <option value="limited">وصول محدود (With Limited Access)</option>
            </select>
          </div>
        </div>

        {/* خط فاصل */}
        <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '12px 0' }} />

        {/* روابط التحديد السريع */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, fontSize: 13 }}>
          <span style={{ fontWeight: 700 }}>All</span>
          <a href="#" onClick={e => { e.preventDefault(); checkAll() }} style={{ color: TEAL }}>Check</a>
          <span style={{ color: '#ccc' }}>|</span>
          <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }} style={{ color: TEAL }}>Uncheck</a>
          <span style={{ color: '#ccc' }}>|</span>
          <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>Invert</a>
        </div>

        {/* العمليات الجماعية */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: 13, flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 700 }}>With all checked</label>
          <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
            style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13, minWidth: 200 }}>
            <option value=""></option>
            <option value="grant_unlimited">Grant Unlimited Access (وصول دائم)</option>
            <option value="grant_limited">Grant Limited Access (وصول محدود)</option>
            <option value="revoke">Revoke Access (سحب الوصول)</option>
          </select>
          <button onClick={handleBulkAction} disabled={!bulkAction || !selected.length}
            style={{
              background: TEAL, color: '#fff', border: 'none', borderRadius: 2,
              padding: '5px 25px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              opacity: (!bulkAction || !selected.length) ? 0.5 : 1
            }}>
            OK
          </button>
        </div>

        {/* حقول التاريخ عند اختيار Limited Access */}
        {bulkAction === 'grant_limited' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, padding: '10px 16px', background: '#f0f9fa', border: `1px solid ${TEAL}`, borderRadius: 4, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontWeight: 700 }}>From:</label>
              <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Until:</label>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }} />
            </div>
          </div>
        )}
      </div>

      {/* عرض العدد */}
      <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '16px 0' }}>
        {'>> '}[ {filtered.length} ]{' <<'}
      </div>

      {/* بطاقات العملاء */}
      <div>
        {!isLoading && filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>لا يوجد عملاء (No customers found)</div>
        ) : filtered.slice(0, showAtLeast).map((c) => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'stretch',
            background: '#f8f8f8', marginBottom: 12,
            borderRight: `8px solid ${c.hasAccess ? '#4caf50' : '#2196f3'}`,
            borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
          }}>
            <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
            </div>
            <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEAL, marginBottom: 6 }}>{c.name}</div>
              <table style={{ fontSize: 13, lineHeight: 1.7 }}>
                <tbody>
                  <tr><td style={flStyle}>الشركة (Company):</td><td>{c.company || '—'}</td></tr>
                  <tr><td style={flStyle}>البريد (Email):</td><td>{c.email || '—'}</td></tr>
                  <tr><td style={flStyle}>المعرف (ID):</td><td>{c.id}</td></tr>
                  <tr><td style={flStyle}>الحالة (Status):</td><td>{statusLabel(c.status)}</td></tr>
                  <tr><td style={flStyle}>تاريخ البدء (Valid From):</td><td>{c.valid_from || c.registered || '—'}</td></tr>
                  <tr><td style={flStyle}>تاريخ الانتهاء (Valid Until):</td><td>{c.valid_until || c.expires || '—'}</td></tr>
                  {c.hasAccess !== undefined && (
                    <tr><td style={flStyle}>نوع الوصول (Access):</td><td style={{ color: c.hasAccess ? '#4caf50' : '#999', fontWeight: 600 }}>
                      {c.hasAccess ? (c.accessType === 'limited' ? 'محدود (Limited)' : 'دائم (Unlimited)') : 'لا يوجد (No Access)'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const flStyle = { fontWeight: 700, paddingLeft: 16, color: '#555', whiteSpace: 'nowrap' }

export default PublicationAccessList
