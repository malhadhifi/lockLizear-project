/**
 * ملف: UsersListPage.jsx
 * الوظيفة: لوحة إدارة العملاء (Manage Customers)
 * الوصف استناداً إلى دليل LockLizard: 
 * - هذه الصفحة مسؤولة عن عرض جميع حسابات العملاء المسجلين.
 * - واجهة المستخدم مطابقة بالكامل للتصميم الأصلي (إصدار V5).
 * - تتضمن شريط القوائم الفرعية الداخلي (إضافة، إدارة، استيراد، تصدير، تغییرات مجمعة).
 * - تحتوي على خيارات الفلترة المتقدمة (فرز، فلترة حسب النص، فلترة حسب الحالة).
 * - تحتوي على خيارات التحديد المتعدد (Bulk Actions) مع زر التنفيذ (موافق).
 * - تم إزالة عارض الويب (Web Viewer) بناءً على طلب المستخدم لتتطابق مع المتطلبات المحددة.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SelectPublicationModal from '../components/SelectPublicationModal'
import SelectDocumentModal from '../components/SelectDocumentModal'
import ConfirmAccessModal from '../components/ConfirmAccessModal'

const MOCK_USERS = [
  { id: 1, name: 'سارة أحمد', company: 'النور تيك', email: 'sara@email.com', status: 'registered', registered: '02 26 2016 17:49:52', webViewer: true, validFrom: '05 26 2016', expires: '' },
  { id: 2, name: 'أحمد علي', company: 'شركة التقنية', email: 'ahmed@email.com', status: 'registered', registered: '01 10 2026', webViewer: true, validFrom: '01 10 2026', expires: '' },
  { id: 3, name: 'محمد خالد', company: '', email: 'mk@hotmail.com', status: 'expired', registered: '', webViewer: true, validFrom: '', expires: '02 15 2012' },
  { id: 4, name: 'نور حسن', company: 'مؤسسة الابتكار', email: 'noor@email.com', status: 'registered', registered: '02 01 2026', webViewer: false, validFrom: '02 01 2026', expires: '' },
]

const TEAL = '#009cad'

const borderColor = {
  registered: '#4caf50',
  suspended: '#ff9800',
  expired: '#f44336',
  not_registered: '#2196f3',
}

const UsersListPage = () => {
  const navigate = useNavigate()
  
  // حالة البيانات (المنسوخة مؤقتاً لحين ربط الـ Backend/Redux)
  const [users, setUsers] = useState(MOCK_USERS)
  
  // حالات الفلترة (Filters States) المذكورة في دليل الاستخدام
  const [filter, setFilter] = useState('')                       // صندوق البحث النصي
  const [sortBy, setSortBy] = useState('name')                   // الفرز حسب (الاسم، الشركة، المعرف)
  const [showAtLeast, setShowAtLeast] = useState(25)             // عدد النتائج المعروضة (10, 25, 50, 100)
  const [showFilter, setShowFilter] = useState('all')            // فلتر الحالة (الكل، مسجل، موقوف، الخ..)
  
  // حالة الأزرار واختيار العناصر المتعددة
  const [selected, setSelected] = useState([])                   // المصفوفة التي تحتوي على معرفات العملاء المحددين
  const [bulkAction, setBulkAction] = useState('')               // الإجراء المحدد من القائمة المنسدلة "مع كل المحدد"
  const [activeSideNav, setActiveSideNav] = useState('manage')   // تبويبة القائمة الجانبية النشطة حالياً
  
  // حالات النوافذ المنبثقة (Modals States) لإعطاء الصلاحيات
  const [isPubModalOpen, setIsPubModalOpen] = useState(false)    // نافذة اختيار المنشور
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)    // نافذة اختيار المستند
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)      // نافذة تأكيد الإجراء
  const [selectedResource, setSelectedResource] = useState(null) // المورد المحدد (منشور أو مستند)

  // دالة الفلترة الأساسية بناءً على المدخلات، تطابق عمليات البحث في الدليل الأصلي
  const filtered = users.filter(u => {
    const s = filter.toLowerCase()
    const matchFilter = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.company || '').toLowerCase().includes(s)
    const matchStatus = showFilter === 'all' || u.status === showFilter
    return matchFilter && matchStatus
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '')
    if (sortBy === 'id') return a.id - b.id
    return 0
  })

  // دوال تحديد العملاء لتنفيذ العمليات المجمعة عليهم
  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const checkAll = () => setSelected(filtered.map(u => u.id))
  const uncheckAll = () => setSelected([])
  const invertSelection = () => setSelected(filtered.map(u => u.id).filter(id => !selected.includes(id)))

  // الدالة الرئيسية المسؤولة عن تنفيذ العمليات المجمعة (Bulk Actions) المذكورة في الفصل 4 من كتاب الدليل
  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    const count = selected.length

    // تعليق حساب العميل
    if (bulkAction === 'Suspend') {
      setUsers(u => u.map(x => selected.includes(x.id) ? { ...x, status: 'suspended' } : x))
      toast.success(`Status: suspended`)
      setSelected([])
      setBulkAction('')
      
    // تفعيل حساب موقوف
    } else if (bulkAction === 'Activate') {
      setUsers(u => u.map(x => selected.includes(x.id) ? { ...x, status: 'registered' } : x))
      toast.success(`Status: enabled`)
      setSelected([])
      setBulkAction('')
      
    // حذف حساب نهائياً
    } else if (bulkAction === 'Delete') {
      if (!window.confirm(`هل أنت متأكد من حذف ${count} عميل؟`)) return
      setUsers(u => u.filter(x => !selected.includes(x.id)))
      toast.success(`تم حذف ${count} عميل`)
      setSelected([])
      setBulkAction('')
      
    // منح حق وصول (لمنشور أو مستند) حيث تفتح نافذة التأكيد إذا تم اختيار المورد
    } else if (bulkAction === 'grant_pub' || bulkAction === 'grant_doc') {
      if (!selectedResource) {
        toast.error('أختر المورد أولاً (Select resource first)')
        return
      }
      setIsConfirmOpen(true) // فتح نافذة يرجى التأكيد
      
    // إعادة إرسال ترخيص المشاهد للمستخدمين
    } else if (bulkAction === 'ResendLicense') {
      toast.success(`تم إعادة إرسال الترخيص لـ ${count} عميل`)
      setSelected([])
      setBulkAction('')
    }
  }

  const confirmGrantAccess = () => {
    toast.success(`تم منح الوصول بنجاح!`)
    setIsConfirmOpen(false)
    setSelected([])
    setBulkAction('')
    setSelectedResource(null)
  }

  const sideNavItems = [
    { id: 'add', label: 'إضافة', icon: 'bi-person-plus-fill', action: () => navigate('/users/create') },
    { id: 'manage', label: 'إدارة', icon: 'bi-people-fill', action: () => setActiveSideNav('manage') },
    { id: 'import', label: 'استيراد', icon: 'bi-box-arrow-in-down', action: () => toast('تم النقر على استيراد') },
    { id: 'export', label: 'تصدير', icon: 'bi-box-arrow-up', action: () => toast('تم النقر على تصدير') },
    { id: 'batch', label: 'تغييرات مجمعة', icon: 'bi-gear-wide-connected', action: () => toast('تم النقر على تغييرات مجمعة') },
  ]

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* === القائمة الجانبية المخصصة للقسم === */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {sideNavItems.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button onClick={item.action}
                style={{
                  width: '100%',
                  textAlign: 'right', /* RTL alignment */
                  padding: '12px 16px',
                  background: activeSideNav === item.id ? TEAL : '#fafafa',
                  color: activeSideNav === item.id ? '#fff' : TEAL,
                  border: '1px solid #ddd',
                  borderBottom: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            </li>
          ))}
          <li style={{ borderTop: '1px solid #ddd' }}></li>
        </ul>
      </div>

      {/* === محتوى القسم الرئيسي === */}
      <div style={{ flex: 1 }}>
        {/* عنوان القسم */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', justifyContent: 'space-between',
          borderRadius: '2px 2px 0 0'
        }}>
          <span>حسابات العملاء (Customer Accounts)</span>
          <span><i className="bi bi-people-fill" /></span>
        </div>

        {/* المحتوى الأبيض */}
        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>

          {/* شريط الفلاتر */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية</label>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
                <span style={{ color: TEAL, fontSize: 16, borderLeft: '1px solid #ccc', padding: '0 8px', border: '1px solid #ccc', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
                <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
                  style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>فرز حسب</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={filterSelectStyle}>
                  <option value="name">الاسم</option>
                  <option value="company">الشركة</option>
                  <option value="id">المعرف</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض على الأقل</label>
                <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={filterSelectStyle}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض</label>
                <select value={showFilter} onChange={e => setShowFilter(e.target.value)} style={filterSelectStyle}>
                  <option value="all">الكل</option>
                  <option value="registered">مسجل</option>
                  <option value="not_registered">غير مسجل</option>
                  <option value="suspended">موقوف</option>
                  <option value="expired">منتهي</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>الكل</span>
              <a href="#" onClick={e => { e.preventDefault(); checkAll() }} style={{ color: TEAL }}>تحديد</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }} style={{ color: TEAL }}>إلغاء التحديد</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس التحديد</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8, fontSize: 13 }}>
              <label style={{ fontWeight: 600, marginTop: 6 }}>مع كل المحدد<br/><span style={{fontSize:11, color:'#777'}}>(With all checked)</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 300 }}>
                <select value={bulkAction} onChange={e => { setBulkAction(e.target.value); setSelectedResource(null) }} style={{ ...filterSelectStyle, minWidth: 200 }}>
                  <option value=""></option>
                  <option value="Suspend">تجميد (Suspend)</option>
                  <option value="Activate">تفعيل (Activate)</option>
                  <option value="Delete">حذف (Delete)</option>
                  <option value="grant_pub">منح حق الوصول إلى منشور: (Grant access to publication:)</option>
                  <option value="grant_doc">منح حق الوصول إلى مستند: (Grant access to document:)</option>
                  <option value="ResendLicense">إعادة إرسال ملف ترخيص العارض (Resend Viewer License File)</option>
                </select>
                
                {bulkAction === 'grant_pub' && (
                  <div style={{ marginTop: 6 }}>
                     <a href="#" onClick={e => { e.preventDefault(); setIsPubModalOpen(true) }} style={{ color: TEAL, textDecoration: 'none', fontSize: 13, fontWeight: 'bold' }}>
                        <i className="bi bi-journal-text" style={{ marginRight: 4 }} /> 
                        Select Publication
                     </a>
                     {selectedResource && bulkAction === 'grant_pub' && <div style={{ color: '#4CAF50', marginTop: 4, fontSize: 12 }}>Selected: {selectedResource.name}</div>}
                  </div>
                )}
                
                {bulkAction === 'grant_doc' && (
                  <div style={{ marginTop: 6 }}>
                     <a href="#" onClick={e => { e.preventDefault(); setIsDocModalOpen(true) }} style={{ color: TEAL, textDecoration: 'none', fontSize: 13, fontWeight: 'bold' }}>
                        <i className="bi bi-file-earmark-text" style={{ marginRight: 4 }} /> 
                        Select Document
                     </a>
                     {selectedResource && bulkAction === 'grant_doc' && <div style={{ color: '#4CAF50', marginTop: 4, fontSize: 12 }}>Selected: {selectedResource.name}</div>}
                  </div>
                )}
              </div>
              <button onClick={handleBulkAction} disabled={!bulkAction || selected.length === 0}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!bulkAction || selected.length === 0) ? 0.5 : 1 }}>
                موافق (OK)
              </button>
            </div>
          </div>
        </div>

        {/* عدد النتائج */}
        <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }}>
          {'>> '} <span style={{ color: TEAL }}>[ {filtered.length} ]</span> {' <<'}
        </div>

        {/* بطاقات العملاء */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>لا يوجد عملاء</div>
          ) : filtered.slice(0, showAtLeast).map((u) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'stretch',
              background: '#f8f8f8',
              marginBottom: 16,
              borderRight: `8px solid ${borderColor[u.status]}`, /* Right border for RTL */
              borderBottom: '1px solid #eee',
              borderTop: '1px solid #eee',
              borderLeft: '1px solid #eee'
            }}>
              {/* Checkbox */}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} />
              </div>

              {/* معلومات العميل */}
              <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
                <div style={{ marginBottom: 8 }}>
                  <a href="#" onClick={e => { e.preventDefault(); navigate(`/users/${u.id}`) }}
                    style={{ color: TEAL, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    {u.name}
                  </a>
                </div>

                <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <tbody>
                    {u.company && (
                      <tr>
                        <td style={fieldLabelStyle}>الشركة:</td>
                        <td style={fieldValueStyle}>{u.company}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={fieldLabelStyle}>البريد الإلكتروني:</td>
                      <td style={fieldValueStyle}>{u.email}</td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>المعرف:</td>
                      <td style={fieldValueStyle}>{u.id}</td>
                    </tr>
                    <tr>
                      <td style={fieldLabelStyle}>الحالة:</td>
                      <td style={fieldValueStyle}>
                        {u.status === 'registered' && (
                          <span>
                            <span style={{ color: '#4caf50' }}>مسجل في {u.registered}</span>
                            <br />
                            <span style={{ color: '#4caf50' }}>مفعل (enabled)</span>
                            <br />
                            <span style={{ color: '#4caf50' }}>وصول عارض الويب: {u.webViewer ? 'نعم' : 'لا'}</span>
                            {u.validFrom && <><br /><span style={{ color: '#4caf50', fontWeight: 700 }}>صالح من {u.validFrom}</span></>}
                          </span>
                        )}
                        {u.status === 'suspended' && (
                          <span style={{ color: '#ff9800' }}>موقوف (suspended)</span>
                        )}
                        {u.status === 'expired' && (
                          <span>
                            <span style={{ color: TEAL }}>غير مسجل (not registered)</span>
                            <br />
                            <span style={{ color: '#4caf50' }}>مفعل (enabled)</span>
                            <br />
                            <span style={{ color: '#4caf50' }}>وصول عارض الويب: {u.webViewer ? 'نعم' : 'لا'}</span>
                            {u.expires && <><br /><span style={{ color: '#f44336', fontWeight: 700 }}>انتهى في {u.expires}</span></>}
                          </span>
                        )}
                        {u.status === 'not_registered' && (
                          <span style={{ color: '#2196f3' }}>غير مسجل</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Icons (Top Left corner for RTL) */}
              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                <ActionIcon icon="bi-slash-circle" color="#ff9800" title="تجميد"
                  onClick={() => setUsers(us => us.map(x => x.id === u.id ? { ...x, status: 'suspended' } : x))} />
                <ActionIcon icon="bi-x" color="#f44336" title="حذف" bold={true}
                  onClick={() => setUsers(us => us.filter(x => x.id !== u.id))} />
                <ActionIcon icon="bi-envelope" color={TEAL} title="إعادة إرسال الترخيص" />
                <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="التفاصيل (Details)" onClick={() => navigate(`/users/${u.id}`)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <SelectPublicationModal 
        isOpen={isPubModalOpen} 
        onClose={() => setIsPubModalOpen(false)} 
        onSelect={(pub) => { setSelectedResource(pub); setIsPubModalOpen(false) }} 
      />
      
      <SelectDocumentModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        onSelect={(doc) => { setSelectedResource(doc); setIsDocModalOpen(false) }} 
      />
      
      <ConfirmAccessModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={confirmGrantAccess}
        actionText="GRANT ACCESS"
        customers={users.filter(u => selected.includes(u.id))}
        resourceName={selectedResource?.name}
      />
    </div>
  )
}

const ActionIcon = ({ icon, color, bg = 'transparent', bold = false, title, onClick }) => (
  <button onClick={onClick} title={title}
    style={{
      background: bg, color: color, border: bg === 'transparent' ? `2px solid ${color}` : 'none',
      borderRadius: '50%', width: 24, height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, padding: 0,
      fontWeight: bold ? 900 : 'normal'
    }}>
    <i className={`bi ${icon}`} />
  </button>
)

const filterInputStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const filterSelectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const fieldLabelStyle = { fontWeight: 700, paddingLeft: 16, verticalAlign: 'top', color: '#111', whiteSpace: 'nowrap' } /* paddingLeft for RTL */
const fieldValueStyle = { color: '#333', verticalAlign: 'top' }

export default UsersListPage
