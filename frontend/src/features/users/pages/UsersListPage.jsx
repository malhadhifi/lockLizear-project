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
import { useCustomers, useCustomerBulkAction } from '../hooks/useUsers'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SelectPublicationModal from '../components/SelectPublicationModal'
import SelectDocumentModal from '../components/SelectDocumentModal'
import ConfirmAccessModal from '../components/ConfirmAccessModal'
const TEAL = '#009cad'

// استخراج دالة مساعدة لتحديد لون الحد الجانبي بناءً على `ui_status` الفعلي
const getBorderColor = (uiStatus) => {
  if (uiStatus?.expired_on) return '#f44336'; // منتهي
  if (uiStatus?.account_status === 'suspend') return '#ff9800'; // موقوف
  return '#4caf50'; // مفعل أو افتراضي
};

const UsersListPage = () => {
  const navigate = useNavigate()
  
  // جلب البيانات الحقيقية من الخادم (Laravel API)
  const { data: usersResponse, isLoading, isError } = useCustomers()
  const users = Array.isArray(usersResponse?.items) ? usersResponse.items 
              : Array.isArray(usersResponse?.data?.items) ? usersResponse.data.items 
              : Array.isArray(usersResponse) ? usersResponse 
              : []
  const bulkMutation = useCustomerBulkAction()
  
  // حالات الفلترة (Filters States) المذكورة في دليل الاستخدام
  const [filter, setFilter] = useState('')                       // صندوق البحث النصي
  const [sortBy, setSortBy] = useState('name')                   // حقل الفرز
  const [showAtLeast, setShowAtLeast] = useState(2)             // عدد النتائج المعروضة (2, 10, 25, 50, 100)
  const [showFilter, setShowFilter] = useState('all')            // فلتر الحالة (الكل، مسجل، موقوف، الخ..)
  const [currentPage, setCurrentPage] = useState(1)              // صفحة النتائج الحالية
  
  // حالة الأزرار واختيار العناصر المتعددة
  const [selected, setSelected] = useState([])                   // المصفوفة التي تحتوي على معرفات العملاء المحددين
  const [bulkAction, setBulkAction] = useState('')               // الإجراء المحدد من القائمة المنسدلة "مع كل المحدد"
  const [activeSideNav, setActiveSideNav] = useState('manage')   // تبويبة القائمة الجانبية النشطة حالياً
  
  // حالات النوافذ المنبثقة (Modals States) لإعطاء الصلاحيات
  const [isPubModalOpen, setIsPubModalOpen] = useState(false)    // نافذة اختيار المنشور
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)    // نافذة اختيار المستند
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)      // نافذة تأكيد الإجراء
  const [selectedResource, setSelectedResource] = useState(null) // المورد المحدد (منشور أو مستند)

  // إذا كان السيرفر يحمل، عرض رسالة انتظار (Loading State)
  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: TEAL }}>جاري تحميل العملاء من الخادم...</div>
  }
  // إذا حدث خطأ أثناء الاتصال (Error State)
  if (isError) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: 'red' }}>حدث خطأ أثناء جلب البيانات! تأكد من تشغيل السيرفر.</div>
  }

  // دالة الفلترة الأساسية بناءً على المدخلات، تطابق عمليات البحث في الدليل الأصلي
  const filtered = users.filter(u => {
    const s = filter.toLowerCase()
    const matchFilter = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.company || '').toLowerCase().includes(s)
    const matchStatus = showFilter === 'all' || 
          (showFilter === 'registered' && u.ui_status?.registration !== 'not registers') ||
          (showFilter === 'not_registered' && u.ui_status?.registration === 'not registers') ||
          (showFilter === 'suspended' && u.ui_status?.account_status === 'suspend') ||
          (showFilter === 'expired' && !!u.ui_status?.expired_on);
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

  // الدالة الرئيسية المسؤولة عن تنفيذ العمليات المجمعة المباشرة (التي لا تتطلب نافذة تأكيد إضافية)
  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return
    const count = selected.length

    // إذا كان الإجراء يتطلب تحديد منشور أو مستند، نظهر النافذة أولاً ولا نرسل الطلب فوراً
    if (bulkAction === 'grant_access_to_publication' || bulkAction === 'grant_access_to_documents') {
      if (!selectedResource) {
        toast.error('الرجاء اختيار العنصر المطلوب المنح إليه (منشور أو مستند) أولاً');
        return;
      }
      setIsConfirmOpen(true);
      return;
    }

    // الإجراءات المباشرة مثل الحذف، الإيقاف، التفعيل
    executeBulkAction(selected, bulkAction);
  }

  // دالة لتنفيذ طلب الـ API الفعلي لتجنب التكرار
  const executeBulkAction = (ids, action, extraPayload = {}) => {
    bulkMutation.mutate({
      license_ids: ids,
      action: action,
      ...extraPayload
    }, {
      onSuccess: () => {
        toast.success(`تم تنفيذ الإجراء ${action} بنجاح!`);
        setSelected([]);
        setBulkAction('');
        setSelectedResource(null);
        setIsConfirmOpen(false);
      },
      onError: (error) => {
        toast.error('حدث خطأ أثناء التنفيذ!');
        console.error('Bulk Action Error:', error);
      }
    });
  }

  // إذا كان السيرفر يحمل، عرض رسالة انتظار (Loading State)
  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: TEAL }}>جاري تحميل العملاء من الخادم...</div>
  }
  // إذا حدث خطأ أثناء الاتصال (Error State)
  if (isError) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: 'red' }}>حدث خطأ أثناء جلب البيانات! تأكد من تشغيل السيرفر.</div>
  }

  const confirmGrantAccess = () => {
    if (!selectedResource) return;
    
    // إرفاق مُعَرّف المورد المختار بناءً على نوع العملية المختارة
    const extraPayload = {};
    if (bulkAction === 'grant_access_to_publication') {
      extraPayload.publication_ids = [selectedResource.id];
    } else if (bulkAction === 'grant_access_to_documents') {
      extraPayload.document_ids = [selectedResource.id];
    }
    
    executeBulkAction(selected, bulkAction, extraPayload);
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
                <input type="text" value={filter} onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                  style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>فرز حسب</label>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }} style={filterSelectStyle}>
                  <option value="name">الاسم</option>
                  <option value="company">الشركة</option>
                  <option value="id">المعرف</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض على الأقل</label>
                <select value={showAtLeast} onChange={e => { setShowAtLeast(Number(e.target.value)); setCurrentPage(1); }} style={filterSelectStyle}>
                  <option value={2}>2</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض</label>
                <select value={showFilter} onChange={e => { setShowFilter(e.target.value); setCurrentPage(1); }} style={filterSelectStyle}>
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
                  <option value="suspend">تجميد (Suspend)</option>
                  <option value="activate">تفعيل (Activate)</option>
                  <option value="delete">حذف (Delete)</option>
                  <option value="grant_access_to_publication">منح حق الوصول إلى منشور: (Grant access to publication:)</option>
                  <option value="grant_access_to_documents">منح حق الوصول إلى مستند: (Grant access to document:)</option>
                  <option value="resend_license">إعادة إرسال ملف ترخيص العارض (Resend Viewer License File)</option>
                </select>
                
                {bulkAction === 'grant_access_to_publication' && (
                  <div style={{ marginTop: 6 }}>
                     <a href="#" onClick={e => { e.preventDefault(); setIsPubModalOpen(true) }} style={{ color: TEAL, textDecoration: 'none', fontSize: 13, fontWeight: 'bold' }}>
                        <i className="bi bi-journal-text" style={{ marginRight: 4 }} /> 
                        Select Publication
                     </a>
                     {selectedResource && <div style={{ color: '#4CAF50', marginTop: 4, fontSize: 12 }}>Selected: {selectedResource.name}</div>}
                  </div>
                )}
                
                {bulkAction === 'grant_access_to_documents' && (
                  <div style={{ marginTop: 6 }}>
                     <a href="#" onClick={e => { e.preventDefault(); setIsDocModalOpen(true) }} style={{ color: TEAL, textDecoration: 'none', fontSize: 13, fontWeight: 'bold' }}>
                        <i className="bi bi-file-earmark-text" style={{ marginRight: 4 }} /> 
                        Select Document
                     </a>
                     {selectedResource && <div style={{ color: '#4CAF50', marginTop: 4, fontSize: 12 }}>Selected: {selectedResource.name}</div>}
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
          ) : filtered.slice((currentPage - 1) * showAtLeast, currentPage * showAtLeast).map((u) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'stretch',
              background: '#f8f8f8',
              marginBottom: 16,
              borderRight: `8px solid ${getBorderColor(u.ui_status)}`, /* Right border for RTL */
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
                        {/* عرض معلومات الحالة المسترجعة من واجهة الباك إند (ui_status) */}
                        <span>
                          {u.ui_status?.registration !== 'not registers' ? (
                            <span style={{ color: '#4caf50' }}>مسجل ({u.ui_status?.registration})<br/></span>
                          ) : (
                            <span style={{ color: '#2196f3' }}>غير مسجل (not registers)<br/></span>
                          )}
                          
                          {u.ui_status?.account_status === 'enabled' ? (
                            <span style={{ color: '#4caf50' }}>مفعل (enabled)<br/></span>
                          ) : (
                            <span style={{ color: '#ff9800' }}>موقوف (suspended)<br/></span>
                          )}

                          {u.ui_status?.expired_on ? (
                            <span style={{ color: '#f44336', fontWeight: 700 }}>منتهي ({u.ui_status?.expired_on})</span>
                          ) : (
                            <>
                              {u.ui_status?.valid_from && <span style={{ color: '#4caf50', fontWeight: 700 }}>{u.ui_status?.valid_from}<br/></span>}
                              {u.ui_status?.valid_until && <span style={{ color: TEAL, fontWeight: 700 }}>{u.ui_status?.valid_until}</span>}
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Icons (Top Left corner for RTL) */}
              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                <ActionIcon icon={u.ui_status?.account_status === 'suspend' ? "bi-check-circle" : "bi-slash-circle"} 
                  color={u.ui_status?.account_status === 'suspend' ? "#4caf50" : "#ff9800"} 
                  title={u.ui_status?.account_status === 'suspend' ? "تفعيل" : "تجميد"}
                  onClick={() => executeBulkAction([u.id], u.ui_status?.account_status === 'suspend' ? 'activate' : 'suspend')} />
                <ActionIcon icon="bi-x" color="#f44336" title="حذف" bold={true}
                  onClick={() => { if(window.confirm('هل أنت متأكد من حذف العميل؟')) executeBulkAction([u.id], 'delete') }} />
                <ActionIcon icon="bi-envelope" color={TEAL} title="إعادة إرسال الترخيص" 
                  onClick={() => { if(window.confirm('هل أنت متأكد من رسال رخصة العارض بالبريد مرة أخرى؟')) executeBulkAction([u.id], 'resend_license') }} />
                <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="التفاصيل (Details)" onClick={() => navigate(`/users/${u.id}`)} />
              </div>
            </div>
          ))}
        </div>

        {/* أزرار صفحات النتائج (Pagination) تعتمد أسهماً صغيرة */}
        {!isLoading && filtered.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, padding: '10px 0' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="السابق (Previous)"
              style={{ background: currentPage === 1 ? '#eee' : '#fff', color: currentPage === 1 ? '#999' : TEAL, border: `1px solid ${currentPage === 1 ? '#ccc' : TEAL}`, padding: '2px 12px', borderRadius: 3, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: 14 }}>
              &lt;&lt;
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>
              [ {currentPage} / {Math.ceil(filtered.length / showAtLeast)} ]
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filtered.length / showAtLeast), p + 1))}
              disabled={currentPage === Math.ceil(filtered.length / showAtLeast)}
              title="التالي (Next)"
              style={{ background: currentPage === Math.ceil(filtered.length / showAtLeast) ? '#eee' : '#fff', color: currentPage === Math.ceil(filtered.length / showAtLeast) ? '#999' : TEAL, border: `1px solid ${currentPage === Math.ceil(filtered.length / showAtLeast) ? '#ccc' : TEAL}`, padding: '2px 12px', borderRadius: 3, cursor: currentPage === Math.ceil(filtered.length / showAtLeast) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: 14 }}>
              &gt;&gt;
            </button>
          </div>
        )}
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
