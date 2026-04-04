import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePublicationSubscribers, useRevokeSubscriberAccess } from '../hooks/usePublications'
import { useCustomerBulkAction } from '../../users/hooks/useUsers'
import SelectCustomerModal from '../../users/components/SelectCustomerModal'
import ConfirmAccessModal from '../../users/components/ConfirmAccessModal'

const PublicationAccessList = ({ publicationId }) => {
  const { data: subsRes, isLoading } = usePublicationSubscribers(publicationId)
  const customers = Array.isArray(subsRes?.data) ? subsRes.data : Array.isArray(subsRes) ? subsRes : []
  
  const revokeMutation = useRevokeSubscriberAccess()
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilter, setShowFilter] = useState('all')
  const [bulkAction, setBulkAction] = useState('')

  const bulkMutation = useCustomerBulkAction()
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedCustomersList, setSelectedCustomersList] = useState([])

  const confirmGrantAccess = () => {
    if (!selectedCustomersList.length) return;
    
    const customerIds = selectedCustomersList.map(c => c.id);
    
    bulkMutation.mutate({
      license_ids: customerIds,
      action: 'grant_access_to_publication',
      publication_ids: [publicationId]
    }, {
      onSuccess: () => {
        toast.success(`تم منح حقوق الوصول لـ ${customerIds.length} عميل بنجاح!`);
        setSelectedCustomersList([]);
        setIsConfirmOpen(false);
        // إعادة جلب لیست العملاء للمنشور الحالي لاحقاً، حالياً الكاش رح يتحدث من الـ hook لو ربطناه صح 
        // الأفضل أن نُشغل تحديث واجهة المشتركين
      },
      onError: (error) => {
        toast.error('حدث خطأ أثناء التنفيذ!');
        console.error('Bulk Action Error:', error);
      }
    });
  }

  const filtered = customers.filter(c => {
    const s = filter.toLowerCase()
    const matchFilter = !s || c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.company.toLowerCase().includes(s)
    const matchStatus = showFilter === 'all' ||
      (showFilter === 'registered' && c.status === 'registered') ||
      (showFilter === 'suspended' && c.status === 'suspended') ||
      (showFilter === 'expired' && c.status === 'expired') ||
      (showFilter === 'not_registered' && c.status === 'not_registered')
    return matchFilter && matchStatus
  })

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id))

  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    if (bulkAction === 'revoke') {
      revokeMutation.mutate({ id: publicationId, customer_ids: selected })
      toast.success(`جاري تنفيذ عملية الإلغاء لـ ${selected.length} عميل...`)
    }
    setSelected([])
    setBulkAction('')
  }

  const statusLabel = (status) => {
    const map = {
      registered: { color: '#2e7d32', bg: '#e8f5e9', text: 'مسجل' },
      suspended: { color: '#e65100', bg: '#fff3e0', text: 'موقوف' },
      expired: { color: '#c62828', bg: '#ffebee', text: 'منتهي' },
      not_registered: { color: '#1565c0', bg: '#e3f2fd', text: 'غير مسجل' },
    }
    const s = map[status] || map.not_registered
    return <span style={{ color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{s.text}</span>
  }

  return (
    <div>
      {/* شريط عنوان أزرق */}
      <div style={{ background: '#0078d4', color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: 13 }}>
        العملاء المصرح لهم (Customer Access) — {customers.length} عميل
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: 20, color: '#0078d4' }}>جارٍ جلب عملاء المنشور... ⏳</div>}

      {/* روابط الوصول السريع لإضافة عملاء */}
      <div style={{ marginBottom: 16, marginTop: 16, display: 'flex', gap: 15, padding: '10px 15px', backgroundColor: '#f0f4f8', border: '1px solid #dce2e8', borderRadius: 4, marginLeft: 16, marginRight: 16 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); setIsCustomerModalOpen(true); }} style={{ color: '#0078d4', textDecoration: 'none', fontWeight: 'bold', fontSize: 13, display: 'flex', alignItems: 'center' }}>
          <i className="bi bi-person-plus-fill" style={{ marginRight: 6, fontSize: 16 }} /> إضافة عملاء (Add Customers)
        </a>
      </div>

      {/* الفلاتر */}
      <div style={{
        padding: '10px 16px', background: '#f0f0f0', borderBottom: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13
      }}>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>فلتر:</label>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="بحث..."
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 8px', width: 160, fontSize: 13 }} />
        </div>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>عرض:</label>
          <select value={showFilter} onChange={e => setShowFilter(e.target.value)}
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
            <option value="all">الكل</option>
            <option value="registered">مسجل</option>
            <option value="suspended">موقوف</option>
            <option value="expired">منتهي</option>
            <option value="not_registered">غير مسجل</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-1">
          <label style={{ fontWeight: 600 }}>ترتيب:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
            <option value="name">الاسم</option>
            <option value="company">الشركة</option>
            <option value="email">البريد</option>
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#e8e8e8', borderBottom: '2px solid #999' }}>
              <th style={thStyle}><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
              <th style={thStyle}>الاسم</th>
              <th style={thStyle}>الشركة</th>
              <th style={thStyle}>البريد الإلكتروني</th>
              <th style={thStyle}>الحالة</th>
              <th style={thStyle}>تاريخ التسجيل</th>
              <th style={thStyle}>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#888' }}>لا يوجد عملاء</td></tr>
            ) : filtered.map((c, idx) => (
              <tr key={c.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginLeft: 6,
                    background: c.status === 'registered' ? '#2e7d32' : c.status === 'suspended' ? '#e65100' : c.status === 'expired' ? '#c62828' : '#1565c0'
                  }} />
                  {c.name}
                </td>
                <td style={tdStyle}>{c.company || '—'}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{statusLabel(c.status)}</td>
                <td style={tdStyle}>{c.registered || '—'}</td>
                <td style={tdStyle}>{c.expires || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* إجراءات جماعية */}
      <div style={{
        padding: '10px 16px', background: '#f0f0f0', borderTop: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
      }}>
        <label style={{ fontWeight: 600 }}>مع كل المحدد:</label>
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          style={{ border: '1px solid #999', borderRadius: 3, padding: '4px 6px', fontSize: 13 }}>
          <option value="">-- اختر --</option>
          <option value="revoke">إلغاء الوصول</option>
        </select>
        <button onClick={handleBulkAction} disabled={!bulkAction || !selected.length || revokeMutation.isPending}
          style={{
            background: '#0078d4', color: '#fff', border: 'none', borderRadius: 3,
            padding: '4px 12px', fontSize: 13, cursor: 'pointer',
            opacity: (!bulkAction || !selected.length) ? 0.5 : 1
          }}>
          تنفيذ
        </button>
        {selected.length > 0 && <span style={{ color: '#555' }}>({selected.length} محدد)</span>}
      </div>

      {/* نوافذ تحديد الوصول المخفية افتراضياً */}
      <SelectCustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
        onSelect={(customers) => { setSelectedCustomersList(customers); setIsCustomerModalOpen(false); setIsConfirmOpen(true); }} 
        multiple={true}
      />
      
      <ConfirmAccessModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={confirmGrantAccess}
        actionText="GRANT ACCESS TO PUBLICATION"
        customers={selectedCustomersList}
        resourceName={`Publication #${publicationId}`}
      />
    </div>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#333', whiteSpace: 'nowrap' }
const tdStyle = { padding: '8px 12px', textAlign: 'right', fontSize: 13, verticalAlign: 'middle' }

export default PublicationAccessList
