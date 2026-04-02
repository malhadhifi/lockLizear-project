/**
 * ملف: DocumentsListPage.jsx
 * الوظيفة: لوحة إدارة المستندات (Manage Documents)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - هذه الصفحة مسؤولة عن عرض وإدارة كافة المستندات المحمية بالـ DRM.
 * - واجهة المستخدم مبنية لتكون متطابقة 100% مع التصميم الأصلي (إصدار V5).
 * - تتضمن شريط القوائم الجانبية (نفس نمط العملاء والمنشورات).
 * - تحتوي على خيارات الفلترة المتقدمة والعمليات الجماعية (تجميد، تفعيل، حذف).
 * - تمت إزالة خيارات "عارض الويب" (Web Viewer) بناءً على طلب المستخدم الشامل.
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل تماماً.
 */

// استيراد مكتبات وحزم React والـ Redux الأساسية لإدارة الحالة والعمليات
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// استيراد أداة التوجيه للتنقل بين الصفحات
import { useNavigate } from 'react-router-dom'
// استيراد مكتبة التنبيهات المنبثقة لإظهار رسائل النجاح والخطأ الشفافة
import toast from 'react-hot-toast'
// استيراد الإجراءات (Actions) من شريحة المستندات في حسابات Redux
import { updateDocumentsStatus, deleteDocuments } from '../store/documentsSlice'

// تعريف اللون الأساسي (Teal) المعتمد في هوية LockLizard لتوحيد التصميم
const TEAL = '#009cad'

// خريطة ألوان الحدود الجانبية للبطاقات (تدل على حالة المستند بصرياً)
const borderColor = {
  valid: '#4caf50',      // أخضر: صالح
  suspended: '#ff9800',  // برتقالي: موقوف
  expired: '#f44336',    // أحمر: منتهي الصلاحية
}

// المكون الرئيسي لصفحة قائمة المستندات
const DocumentsListPage = () => {
  // دالة تُستخدم للتحويل البرمجي بين نوافذ التطبيق
  const navigate = useNavigate()
  // أداة إرسال الحزم للـ Redux (Dispatch)
  const dispatch = useDispatch()
  
  // الاستماع لحالة (State) بيانات المستندات من متجر الـ Redux
  const documents = useSelector(state => state.documents.list)

  // حالات (States) خاصة بالفلترة والبحث
  const [filter, setFilter] = useState('')                        // مربع النص للبحث
  const [sortBy, setSortBy] = useState('name')                    // القائمة المنسدلة للفرز
  const [showAtLeast, setShowAtLeast] = useState(25)              // الحد الأدنى للمقروءات في الصفحة
  const [showFilter, setShowFilter] = useState('all')             // الفلتر المخصص لحالة المستند (الكل، صالح، موقوف..)
  
  // حالة (State) لأسلوب الاختيار المتعدد (Bulk Selection) عبر مربعات الاختيار
  const [selected, setSelected] = useState([])
  // حالة (State) لتخزين الإجراء الجماعي المختار للمستندات
  const [bulkAction, setBulkAction] = useState('')
  // حالة (State) لمعرفة أي تبويبة من القائمة الجانبية الداخلية هي النشطة حالياً
  const [activeSideNav, setActiveSideNav] = useState('manage')

  // حساب القائمة المصفاة والمفرزة (Filtered & Sorted) عند تغيّر المستندات أو الفلاتر
  const filtered = useMemo(() => {
    // أخذ نسخة من المصفوفة كاملة
    let result = [...documents]
    
    // فلترة نصية إذا طُلب ذلك
    if (filter) {
      const s = filter.toLowerCase()
      // البحث في اسم المستند
      result = result.filter(d => d.name.toLowerCase().includes(s))
    }
    
    // التصفية حسب حالة المستند بناءً للقائمة المنسدلة (Show)
    if (showFilter !== 'all') {
      result = result.filter(d => d.status === showFilter)
    }

    // فرز النتيجة النهائية (التشجير)
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'id') return a.id - b.id
      if (sortBy === 'published') return new Date(b.publishedDate) - new Date(a.publishedDate)
      return 0
    })
    
    return result
  }, [documents, filter, sortBy, showFilter])

  // دوال تحديد المستندات لمعاملتها كحزمة
  // دالة عكس تحديد مستند معين
  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  // دالة التحديد الشامل لكافة ما هو معروض
  const checkAll = () => setSelected(filtered.map(d => d.id))
  // دالة إزالة التحديد الشامل
  const uncheckAll = () => setSelected([])
  // دالة عكس التحديدات (قلب الخيارات)
  const invertSelection = () => setSelected(filtered.map(d => d.id).filter(id => !selected.includes(id)))

  // دالة معالجة العمليات المجمعة التي تُحدد من القائمة وتُنفذ عبر النقر على زر "موافق"
  const handleBulkAction = () => {
    // إجهاض المهمة إن لم يتم عمل تحديد أو اختيار للإجراء
    if (!selected.length || !bulkAction) return
    const count = selected.length

    // إيقاف وتجميد مجموعة من المستندات
    if (bulkAction === 'Suspend') {
      dispatch(updateDocumentsStatus({ ids: selected, status: 'suspended' }))
      toast.success(`تم إيقاف (Suspend) ${count} مستند`)
      
    // تفعيل وتنشيط مجموعة من المستندات الموقوفة
    } else if (bulkAction === 'Activate') {
      dispatch(updateDocumentsStatus({ ids: selected, status: 'valid' }))
      toast.success(`تم تفعيل (Activate) ${count} مستند`)
      
    // حذف مجموعة من المستندات بشكل نهائي (من العرض الوهمي)
    } else if (bulkAction === 'Delete') {
      // إطلاق نافذة الأمان المنبثقة للتأكد
      if (!window.confirm(`هل أنت متأكد من حذف ${count} مستند بشكل نهائي؟`)) return
      dispatch(deleteDocuments({ ids: selected }))
      toast.success(`تم حذف ${count} مستند بنجاح`)
    }
    
    // تصفير مؤشرات الاختيار والعملية بعد الفراغ
    setSelected([])
    setBulkAction('')
  }

  // مصفوفة قائمة التنقل الجانبية لتسهيل رسمها برمجياً والمحافظة على النمطية
  const sideNavItems = [
    // لا يوجد في العادة إضافة مستند يدوي كنموذج (حيث تُرفع من الكاتب Writer App) ولكن وضعناها للعرض
    { id: 'manage', label: 'إدارة (Manage)', icon: 'bi-file-earmark-text-fill', action: () => setActiveSideNav('manage') },
    { id: 'export', label: 'تصدير (Export CSV)', icon: 'bi-box-arrow-up', action: () => toast('تم النقر على تصدير السجلات المصفاة') },
  ]

  // === بداية رسم واجهة المستخدم الحقيقية (Render) ===
  return (
    // الغلاف العام للمحتوى، منقسم لجزأين بتباعد منتظم
    <div style={{ display: 'flex', gap: 20 }}>
      
      {/* === القائمة الجانبية الداخلية المخصصة لقسم المستندات === */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {/* توليد أزرار القوائم بآلية الـ Map المعتادة */}
          {sideNavItems.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button type="button" onClick={item.action}
                // التنسيق الديناميكي ليتغير لون الزر حين يصبح هو النشط (Active)
                style={{
                  width: '100%', textAlign: 'right', padding: '12px 16px',
                  background: activeSideNav === item.id ? TEAL : '#fafafa',
                  color: activeSideNav === item.id ? '#fff' : TEAL,
                  border: '1px solid #ddd', borderBottom: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
                }}>
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            </li>
          ))}
          {/* إغلاق حافة المربع بتحديد الخط السفلي للسطر الوهمي */}
          <li style={{ borderTop: '1px solid #ddd' }}></li>
        </ul>
      </div>

      {/* === القسم الرئيسي العريض لإدارة المستندات === */}
      <div style={{ flex: 1 }}>
        
        {/* الترويسة الرئيسية الداكنة (Teal Header) المطابقة لهوية النظام */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', borderRadius: '2px 2px 0 0'
        }}>
          {/* دمج العنوان باللغتين للدقة */}
          <span>إدارة المستندات المحمية (Manage Documents)</span>
          {/* أيقونة المستند */}
          <span><i className="bi bi-file-earmark-lock-fill" /></span>
        </div>

        {/* الصندوق الأبيض الشامل لجميع أدوات التحكم بالفرز والفلترة */}
        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
          
          <div style={{ marginBottom: 12 }}>
            
            {/* صف الإدخال النصي (شريط البحث) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية (Filter)</label>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
                {/* علامة المجهر/العدسة كمظهر جمالي ملتصق بالحقل */}
                <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
                {/* حقل الفلترة المربوط مباشرة بالحالة (State) */}
                <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
                  style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
              </div>
            </div>

            {/* صف القوائم المنسدلة الثلاث (الفرز، العدد، والحالة) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
              
              {/* فرشة منسدلة لتحديد الحقل الذي نفرز بناءً عليه */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>فرز حسب (Sort by)</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={filterSelectStyle}>
                  <option value="name">الاسم (Name)</option>
                  <option value="id">المعرف (ID)</option>
                  <option value="published">تاريخ النشر (Published Date)</option>
                </select>
              </div>
              
              {/* فرشة منسدلة لتحديد الحد الأدنى المعروض */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض على الأقل (Show at least)</label>
                <select value={showAtLeast} onChange={e => setShowAtLeast(Number(e.target.value))} style={filterSelectStyle}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              {/* فرشة منسدلة لفلترة وضع وحالة المستند */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض (Show)</label>
                <select value={showFilter} onChange={e => setShowFilter(e.target.value)} style={filterSelectStyle}>
                  <option value="all">الكل (All)</option>
                  <option value="valid">صالح (Valid)</option>
                  <option value="suspended">موقوف (Suspended)</option>
                  <option value="expired">منتهي (Expired)</option>
                </select>
              </div>
              
            </div>

            {/* الفاصل الرفيع الكلاسيكي بين الفلاتر والعمليات المتعددة */}
            <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

            {/* روابط التحكم بالاختيارات (التي تمثل الـ Select All في برامج الويندوز) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>الكل (All)</span>
              <a href="#" onClick={e => { e.preventDefault(); checkAll() }} style={{ color: TEAL }}>تحديد (Check)</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }} style={{ color: TEAL }}>إلغاء التحديد (Uncheck)</a> <span style={{ color: '#ccc' }}>|</span>
              <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس التحديد (Invert)</a>
            </div>

            {/* الجزء المركزي الذي يحتوي على أمر الإجراء الجماعي المنسدل */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, fontSize: 13 }}>
              <label style={{ fontWeight: 600 }}>مع كل المحدد (With all checked)</label>
              {/* اختيار نوع و وجهة العملية الجماعية */}
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} style={{ ...filterSelectStyle, minWidth: 200, flex: 1, maxWidth: 300 }}>
                <option value=""></option>
                <option value="Suspend">إيقاف (Suspend)</option>
                <option value="Activate">تفعيل (Activate)</option>
                <option value="Delete">حذف (Delete)</option>
              </select>
              {/* زر تفعيل العملية وهو مربوط بتأكيد توفر كلا الشرطين الاختيار والفعل */}
              <button type="button" onClick={handleBulkAction} disabled={!bulkAction || selected.length === 0}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!bulkAction || selected.length === 0) ? 0.5 : 1 }}>
                موافق (OK)
              </button>
            </div>

          </div>
        </div>

        {/* عرض رقمي مائل يوضح الحصيلة الرقمية لما هو معروض في الشاشة */}
        <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }} dir="ltr">
          {'>> '} <span style={{ color: TEAL }}>[ {filtered.length} ]</span> {' <<'}
        </div>

        {/* الساحة العامة لعرض بطاقات المستندات كنصوص شبكية منتظمة (Cards mimicking Tables) */}
        <div>
          {filtered.length === 0 ? (
            // في حالة انعدام وجود أي بيانات مطابقة
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>لا توجد مستندات مطابقة للبحث (No documents found)</div>
          ) : 
            // عمل دوران ورسم لكل مستند مفلتر عبر الماب (Map)
            filtered.slice(0, showAtLeast).map((doc) => (
            
            // الغلاف الخارجي لكل بطاقة مستند
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'stretch',
              background: '#f8f8f8', marginBottom: 16,
              // ألوان متوهجة للحد الجانبي للدلالة على حالة المستند بصرياً بلمحة سريعة (من قاموس الألوان)
              borderRight: `8px solid ${borderColor[doc.status] || '#ccc'}`,
              borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
            }}>
              
              {/* خلية الاختيار (مربع التحديد الفردي) للبطاقة */}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} />
              </div>

              {/* الكتلة المركزية الخاصة بالمعلومات والخصائص النصية للمستند */}
              <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
                
                {/* اسم المستند الكبير والذي يمثل شريان النقر لصفحة التفاصيل */}
                <div style={{ marginBottom: 8 }}>
                  <a href="#" onClick={e => { e.preventDefault(); navigate(`/documents/${doc.id}`) }}
                    style={{ color: TEAL, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    {doc.name}
                  </a>
                </div>
                
                {/* شبكة داخلية وهمية لترتيب الخواص كمصفوفة (Key-Value) للحقول */}
                <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <tbody>
                    
                    {/* المعرف الأساسي الخاص بقواعد البيانات الحقيقية للخادم */}
                    <tr>
                      <td style={fieldLabelStyle}>المعرف (ID)</td>
                      <td style={fieldValueStyle}>{doc.id}</td>
                    </tr>
                    
                    {/* وقت إضافة ونشر المستند لأول مرة */}
                    <tr>
                      <td style={fieldLabelStyle}>تاريخ النشر (Published)</td>
                      <td style={fieldValueStyle}>{doc.publishedDate}</td>
                    </tr>
                    
                    {/* وضعية ورخصة المستند الحالية مع الألوان التعبيرية */}
                    <tr>
                      <td style={fieldLabelStyle}>الحالة (Status)</td>
                      <td style={fieldValueStyle}>
                        {doc.status === 'valid' && (
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>صالح (Valid)</span>
                        )}
                        {doc.status === 'suspended' && (
                          <span style={{ color: '#ff9800', fontWeight: 600 }}>موقوف (Suspended)</span>
                        )}
                        {doc.status === 'expired' && (
                          <span style={{ color: '#f44336', fontWeight: 600 }}>منتهي الصلاحية (Expired) - {doc.expires}</span>
                        )}
                      </td>
                    </tr>
                    
                    {/* الرابط النصي لعدد العملاء الذين قام الناشر بإعطائهم حق الوصول */}
                    <tr>
                      <td style={fieldLabelStyle}>العملاء المسموح لهم (Customers)</td>
                      <td style={fieldValueStyle}>
                        <a href="#" onClick={e => { e.preventDefault(); navigate(`/documents/${doc.id}`, { state: { tab: 'access' } }) }}
                          style={{ color: TEAL, fontWeight: 'bold' }}>{doc.customersCount}</a>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* ساحة أزرار الإجراءات الفورية والسريعة في الجهة اليسرى (أو اليمنى للزوار الانجليزي) */}
              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                {/* زر الإيقاف الفردي بحركة تغيير حالة داخلية (تعطيل/إيقاف) */}
                <ActionIcon icon="bi-slash-circle" color="#ff9800" title="إيقاف (Suspend)"
                  onClick={() => dispatch(updateDocumentsStatus({ ids: [doc.id], status: 'suspended' }))} />
                {/* زر الحذف الفردي (يسأل عن التأكيد عبر رسالة المنبثق) */}
                <ActionIcon icon="bi-x" color="#f44336" title="حذف (Delete)" bold={true}
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستند نهائياً؟')) {
                      dispatch(deleteDocuments({ ids: [doc.id] }))
                    }
                  }} />
                {/* الزر الرئيسي للمزيد من الإعدادات وقيادات الطباعة للـ DRM (يُوجّه للتفاصيل) */}
                <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="عرض التفاصيل (View Details)" 
                  onClick={() => navigate(`/documents/${doc.id}`)} />
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// مكون (Component) صغير وحُر وقابل لإعادة الاستخدام لرسم أزرار الأيقونات بكود أنظف ومقروء للمتصفحات
const ActionIcon = ({ icon, color, bg = 'transparent', bold = false, title, onClick }) => (
  <button type="button" onClick={onClick} title={title}
    // تخصيص الأنماط لتلوين الأيقونات ورسمها بحواف دائرية مثالية
    style={{
      background: bg, color: color, border: bg === 'transparent' ? `2px solid ${color}` : 'none',
      borderRadius: '50%', width: 24, height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, padding: 0,
      fontWeight: bold ? 900 : 'normal'
    }}>
    {/* استخدام أيقونات الـ Bootstrap لزخرفة الشكل النهائي */}
    <i className={`bi ${icon}`} />
  </button>
)

// استايلات وأنماط منفصلة لتخفيف إرباك الكثافة الكودية داخل الـ JSX
const filterInputStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
const filterSelectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
// تنسيق العناوين العريضة لأسطر المعلومات ضمن البطاقة مع المحافظة على مساحات التراجع للغة الـ RTL
const fieldLabelStyle = { fontWeight: 700, paddingLeft: 16, verticalAlign: 'top', color: '#111', whiteSpace: 'nowrap' }
// تنسيق البيانات وقيمها بجانب العناوين
const fieldValueStyle = { color: '#333', verticalAlign: 'top' }

// تصدير واجهة إدارة المستندات ليستقبلها جهاز الربط العام (Router)
export default DocumentsListPage
