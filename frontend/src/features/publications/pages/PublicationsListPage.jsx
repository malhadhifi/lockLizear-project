/**
 * ملف: PublicationsListPage.jsx
 * الوظيفة: لوحة إدارة المنشورات (Manage Publications)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - هذه الصفحة مسؤولة عن عرض جميع المنشورات (Publications).
 * - واجهة المستخدم مبنية لتكون متطابقة 100% مع التصميم الأصلي (إصدار V5).
 * - تتضمن شريط القوائم الجانبية (إضافة، إدارة).
 * - تحتوي على خيارات الفلترة المتقدمة (فرز، فلترة نصية، فلترة حسب حالة الالتزام بالتاريخ).
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل تماماً كما طلب المستخدم.
 */

// استيراد مكتبات React الأساسية لإدارة الحالة والعمليات الحسابية المحفوظة
import { useState, useMemo } from 'react'
// استيراد أداة التوجيه للتنقل بين الصفحات السباتية
import { useNavigate } from 'react-router-dom'
// استيراد الخطافات الجديدة لجلب البيانات من الباك إند
import { usePublications, usePublicationBulkAction } from '../hooks/usePublications'
// استيراد مكتبة التنبيهات المنبثقة لإظهار رسائل النجاح والخطأ
import toast from 'react-hot-toast'

// تعريف اللون الأساسي (Teal) المعتمد في هوية LockLizard
const TEAL = '#009cad'

// تعريف النمط الخاص بمدخلات الفلترة
const filterInputStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
// تعريف النمط الخاص بالقوائم المنسدلة للفلترة
const filterSelectStyle = { border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', fontSize: 13 }
// تعريف النمط لعناوين الحقول داخل بطاقة المنشور
const fieldLabelStyle = { fontWeight: 700, paddingLeft: 16, verticalAlign: 'top', color: '#111', whiteSpace: 'nowrap' }
// تعريف النمط لقيم الحقول داخل بطاقة المنشور
const fieldValueStyle = { color: '#333', verticalAlign: 'top' }

// المكون الرئيسي لصفحة قائمة المنشورات
const PublicationsListPage = () => {
  // دالة تُستخدم للتحويل البرمجي بين روابط التطبيق
  const navigate = useNavigate()
  // تفعيل خطافات جلب المنشورات والعمليات المجمعة من React Query
  const { data: publicationsResponse, isLoading, isError } = usePublications({ limit: 1000 })
  const bulkMutation = usePublicationBulkAction()
  
  // استخراج قائمة المنشورات الحقيقية من كائن البيانات (Items)
  const publications = publicationsResponse?.items || publicationsResponse?.data?.items || []

  // حالة (State) للبحث النصي الحر
  const [filter, setFilter] = useState('')
  // حالة (State) لتحديد بناءً على أي حقل يتم الفرز
  const [sortBy, setSortBy] = useState('name')
  // حالة (State) لعدد السجلات المعروضة بحد أدنى كصفحات
  const [showAtLeast, setShowAtLeast] = useState(2)
  // رقم الصفحة الحالية
  const [currentPage, setCurrentPage] = useState(1)
  // حالة (State) للفلترة حسب نوع المنشور (الكل، ملتزم بالتاريخ، لا يلتزم)
  const [showFilter, setShowFilter] = useState('all')
  // حالة (State) لتخزين معرفات (IDs) المنشورات المحددة عبر مربعات الاختيار
  const [selected, setSelected] = useState([])
  // حالة (State) لتخزين الخيار المجمع (Bulk Action) المراد تنفيذه
  const [bulkAction, setBulkAction] = useState('')
  // حالة (State) لمعرفة أي تبويبة من القائمة الجانبية هي النشطة حالياً
  const [activeSideNav, setActiveSideNav] = useState('manage')

  // حساب القائمة المصفاة والمفرزة (Filtered & Sorted) لتحديثها تلقائياً عند تغير أي فلتر
  const filtered = useMemo(() => {
    // أخذ نسخة من قائمة المنشورات الأصلية
    let result = [...publications]
    
    // إذا كان هناك نص في حقل البحث
    if (filter) {
      // تحويل النص إلى حروف صغيرة للمقارنة الدقيقة
      const s = filter.toLowerCase()
      // تصفية المنشورات التي يحتوي اسمها أو مسماها على النص المدخل
      result = result.filter(p => p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)))
    }
    
    // التصفية حسب حالة "الالتزام بتاريخ البدء"
    if (showFilter === 'obey') {
      // إبقاء المنشورات التي تلتزم بتاريخ البدء فقط
      result = result.filter(p => p.obey)
    } else if (showFilter === 'no-obey') {
      // إبقاء المنشورات التي لا تلتزم بتاريخ البدء فقط
      result = result.filter(p => !p.obey)
    }

    // فرز النتيجة النهائية
    result.sort((a, b) => {
      // الفرز أبجدياً بناءً على الاسم
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'id') return a.id - b.id
      if (sortBy === 'date') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      return 0
    })
    
    // إرجاع القائمة النهائية المجهزة للعرض
    return result
  }, [publications, filter, sortBy, showFilter])

  // دالة عكس تحديد منشور معين (عبر مربع الاختيار الخاص به)
  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  // دالة تحديد جميع المنشورات المعروضة حالياً ضمن الفلترة
  const checkAll = () => setSelected(filtered.map(p => p.id))
  // دالة إلغاء تحديد كافة المنشورات المحددة
  const uncheckAll = () => setSelected([])
  // دالة عكس التحديدات (تحديد العناصر غير المحددة، والعكس بالعكس)
  const invertSelection = () => setSelected(filtered.map(p => p.id).filter(id => !selected.includes(id)))

  // دالة تنفيذ العمليات الجماعية (مثل إجراء حذف جماعي)
  const handleBulkAction = () => {
    // التأكد من اختيار إجراء وتحديد عنصر واحد على الأقل
    if (!selected.length || !bulkAction) return
    
    // في حالة اختيار الحذف
    if (bulkAction === 'Delete') {
      // سؤال المستخدم لتأكيد الحذف
      if (!window.confirm(`هل أنت متأكد من حذف ${selected.length} منشور؟`)) return
      // إرسال طلب الحذف الجماعي للباك إند عبر React Query
      bulkMutation.mutate({ publication_ids: selected, action: 'delete' })
      // إظهار رسالة تفيد بنجاح العملية
      toast.success(`تم حذف ${selected.length} منشور بنجاح (Deleted)`)
    }
    
    // تصفير الاختيارات والإجراء بعد الانتهاء
    setSelected([])
    setBulkAction('')
  }

  // دالة معالجة الحذف الفردي لمنشور واحد عبر زر الـ (X) الأحمر
  const handleDelete = (id) => {
    // سؤال المستخدم للتأكيد الفردي
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنشور؟ (Are you sure you want to delete this publication?)')) return
    // إرسال طلب الحذف الفردي (نستخدم الحذف المجمع بعنصر واحد كأسرع طريقة)
    bulkMutation.mutate({ publication_ids: [id], action: 'delete' })
  }

  // مصفوفة قائمة التنقل الجانبية لتسهيل معالجتها
  const sideNavItems = [
    // زر الانتقال إلى شاشة إضافة منشور جديد
    { id: 'add', label: 'إضافة (Add)', icon: 'bi-plus-circle-fill', action: () => navigate('/publications/create') },
    // زر إبقاء شاشة الإدارة نشطة
    { id: 'manage', label: 'إدارة (Manage)', icon: 'bi-collection-fill', action: () => setActiveSideNav('manage') }
  ]

  // === بداية رسم واجهة المستخدم (Render) ===
  return (
    // الغلاف العام للمحتوى ينفصل لعمودين (شريط جانبي، والقسم الرئيسي)
    <div className="page-layout">
      
      {/* === القائمة الجانبية الداخلية المخصصة لقسم المنشورات === */}
      <div className="page-sidebar">
        {/* قائمة بدون نقاظ ترتيبية */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {/* حلقة تكرارية لرسم أزرار القائمة الجانبية */}
          {sideNavItems.map(item => (
            // كل عنصر عبارة عن سطر يحتوي على زر
            <li key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <button onClick={item.action}
                // تخصيص الأنماط لزر التبويبة (خلفية Teal إذا كانت نشطة)
                style={{
                  width: '100%', textAlign: 'right', padding: '12px 16px',
                  background: activeSideNav === item.id ? TEAL : '#fafafa',
                  color: activeSideNav === item.id ? '#fff' : TEAL,
                  border: '1px solid #ddd', borderBottom: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
                }}>
                {/* الأيقونة المعبرة عن التبويبة */}
                <i className={`bi ${item.icon}`} />
                {/* اسم التبويبة باللغتين */}
                {item.label}
              </button>
            </li>
          ))}
          {/* خط وهمي لإكمال شكل الصندوق السُفلي للقائمة الملحقة */}
          <li style={{ borderTop: '1px solid #ddd' }}></li>
        </ul>
      </div>

      {/* === القسم الرئيسي الواسع لمحتوى المنشورات === */}
      <div className="page-content">
        
        {/* الترويسة الرئيسية الخاصة بـ LockLizard باللون الـ Teal وتنسيق مُطابق للمانيوال */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', borderRadius: '2px 2px 0 0'
        }}>
          {/* نص عنوان الإدارة مع اللغة المزدوجة */}
          <span>إدارة المنشورات (Manage Publications)</span>
          {/* أيقونة الكتب المتراصة */}
          <span><i className="bi bi-collection-fill" /></span>
        </div>

        {/* الصندوق الأبيض الذي يحتوي على الفلاتر والعمليات المجمعة */}
        <div style={{ border: `1px solid ${TEAL}`, borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
          
          {/* حاوية لجميع الفلاتر */}
          <div style={{ marginBottom: 12 }}>
            
            {/* شريط البحث النصي (Filter) */}
            <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              {/* عنوان دلالي للبحث */}
              <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية (Filter)</label>
              {/* مجموعة حقل الإدخال مع الأيقونة الملتصقة به */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
                {/* أيقونة العدسة للمظهر الجميل */}
                <span style={{ color: TEAL, fontSize: 16, padding: '0 8px', border: '1px solid #ccc', borderLeft: 'none', height: 28, display: 'flex', alignItems: 'center', background: '#fafafa' }}>🔍</span>
                {/* حقل الإدخال لربط القيمة بحالة الفلتر الخاصة بـ React */}
                <input type="text" value={filter} onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                  style={{ ...filterInputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, height: 28 }} />
              </div>
            </div>

            {/* صف القوائم المنسدلة للفرز وعرض الأعداد */}
            <div className="mobile-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
              
              {/* فرز حسب (Sort by) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>فرز حسب (Sort by)</label>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }} style={filterSelectStyle}>
                  <option value="name">الاسم (Name)</option>
                  <option value="id">المعرف (ID)</option>
                  <option value="date">تاريخ الإضافة (Date Added)</option>
                </select>
              </div>
              
              {/* عرض على الأقل (Show at least) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض على الأقل (Show at least)</label>
                <select value={showAtLeast} onChange={e => { setShowAtLeast(Number(e.target.value)); setCurrentPage(1); }} style={filterSelectStyle}>
                  <option value={2}>2</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              {/* عرض فلتر الحالة (Show) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontWeight: 600 }}>عرض (Show)</label>
                <select value={showFilter} onChange={e => { setShowFilter(e.target.value); setCurrentPage(1); }} style={filterSelectStyle}>
                  <option value="all">الكل (All)</option>
                  <option value="obey">الالتزام بالتاريخ (Obey)</option>
                  <option value="no-obey">عدم الالتزام بالتاريخ (Don't Obey)</option>
                </select>
              </div>
              
            </div>

            {/* خط فاصل رمادي أنيق لفصل الفلاتر عن الإجراءات المتعددة */}
            <hr style={{ border: 'none', borderTop: '1px solid #a3d9df', margin: '16px 0' }} />

            {/* الروابط الزرقاء لتحديد أو إلغاء تحديد مربعات الاختيار */}
            <div className="mobile-check-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13 }}>
              {/* النص المرجعي الثابت */}
              <span style={{ fontWeight: 600 }}>الكل (All)</span>
              {/* رابط سريع لتحديد كل العناصر الحالية المعروضة */}
              <a href="#" onClick={e => { e.preventDefault(); checkAll() }} style={{ color: TEAL }}>تحديد (Check)</a> <span style={{ color: '#ccc' }}>|</span>
              {/* رابط سريع لإلغاء تحديد كافة الاختيارات */}
              <a href="#" onClick={e => { e.preventDefault(); uncheckAll() }} style={{ color: TEAL }}>إلغاء التحديد (Uncheck)</a> <span style={{ color: '#ccc' }}>|</span>
              {/* رابط سريع لعكس تحديدات المربعات */}
              <a href="#" onClick={e => { e.preventDefault(); invertSelection() }} style={{ color: TEAL }}>عكس التحديد (Invert)</a>
            </div>

            {/* الجزء الخاص بتنفيذ الإجراءات المتعددة (Bulk Actions) المنسدلة بناءً للمانيوال */}
            <div className="mobile-bulk-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, fontSize: 13 }}>
              {/* التسمية التوضيحية للقائمة المنسدلة للعمليات المتعددة */}
              <label style={{ fontWeight: 600 }}>مع كل المحدد (With all checked)</label>
              {/* القائمة المنسدلة التي تتضمن كافة خيارات التعديل الجماهيري */}
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} style={{ ...filterSelectStyle, minWidth: 200, flex: 1, maxWidth: 300 }}>
                {/* الخيار الافتراضي فارغ */}
                <option value=""></option>
                {/* خيار الحذف الجماعي */}
                <option value="Delete">حذف (Delete)</option>
              </select>
              {/* زر تنفيذ الإجراء الجماعي، بلون Teal بارز */}
              <button onClick={handleBulkAction} disabled={!bulkAction || selected.length === 0}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '6px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!bulkAction || selected.length === 0) ? 0.5 : 1 }}>
                موافق (OK)
              </button>
            </div>

          </div>
        </div>

        {/* سطر يعرض إجمالي عدد المنشورات الموجودة تحت هذا الفلتر بتصميم LockLizard التقليدي المائل */}
        <div style={{ textAlign: 'center', color: TEAL, fontSize: 13, fontWeight: 700, margin: '20px 0' }} dir="ltr">
          {'>> '} <span style={{ color: TEAL }}>[ {filtered.length} ]</span> {' <<'}
        </div>

        {/* مؤشر التحميل أثناء الجلب من الباك إند */}
        {isLoading && <div style={{ textAlign: 'center', padding: 40, color: TEAL }}>جارٍ تحميل المنشورات من الخادم... ⏳</div>}
        {isError && <div style={{ textAlign: 'center', padding: 40, color: 'red' }}>عذراً، حدث خطأ أثناء الاتصال بالخادم. ❌</div>}

        {/* حاوية بطاقات المنشورات بالأسلوب الشريطي (Cards List View) المعتمد بنظام العرض الحالي */}
        <div>
          {/* إذا كانت النتيجة صفر والتحميل مكتمل، نعرض رسالة لا يوجد بيانات */}
          {!isLoading && !isError && filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>لا توجد منشورات (No publications found)</div>
          ) : 
            // عمل دوران (Mapping) لجميع المنشورات المتطابقة بعد تقليمها بناءً لمقدار العرض المطلوب والصفحة
            filtered.slice((currentPage - 1) * showAtLeast, currentPage * showAtLeast).map((pub) => (
            
            // بداية تصميم البطاقة (Card) الشبيهة بأسطر الجدول الأنيقة، لكل منشور
            <div key={pub.id} className="mobile-card" style={{
              display: 'flex', alignItems: 'stretch',
              background: '#f8f8f8', marginBottom: 16,
              borderRight: `8px solid ${pub.obey ? '#4caf50' : '#2196f3'}`,
              borderBottom: '1px solid #eee', borderTop: '1px solid #eee', borderLeft: '1px solid #eee'
            }}>
              
              {/* مستطيل مربع الاختيار الخاص بالعنصر الفردي */}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={selected.includes(pub.id)} onChange={() => toggleSelect(pub.id)} />
              </div>

              {/* المنطقة المركزية للبطاقة وتحوي كل التفاصيل المجدولة كنصوص ومعلومات */}
              <div style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}>
                
                {/* رابط اسم المنشور المعبر والكبير يذهب لصفحة التعديل حال الضغط عليه */}
                <div style={{ marginBottom: 8 }}>
                  <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`) }}
                    style={{ color: TEAL, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    {pub.name}
                  </a>
                </div>
                
                {/* جدول خفي صغير لعرض الخواص بشكل شبكي منتظم ودقيق للحفاظ على المحاذاة */}
                <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <tbody>
                    
                    {/* صف عرض الوصف الشامل */}
                    <tr>
                      <td style={fieldLabelStyle}>الوصف (Description)</td>
                      <td style={fieldValueStyle}>{pub.description || '—'}</td>
                    </tr>
                    
                    {/* صف الدلالة الرقمية أو الآي دي الخاص بقواعد البيانات الحقيقية الموازية */}
                    <tr>
                      <td style={fieldLabelStyle}>المعرف (ID)</td>
                      <td style={fieldValueStyle}>{pub.id}</td>
                    </tr>
                    
                    {/* إشعار بوضعية الالتزام بتواريخ التفعيل */}
                    <tr>
                      <td style={fieldLabelStyle}>تاريخ البدء للعميل (Obey Start Date)</td>
                      <td style={fieldValueStyle}>
                        <span style={{ color: pub.obey ? '#4caf50' : '#999' }}>
                          {pub.obey ? 'نعم (Yes)' : 'لا (No)'}
                        </span>
                      </td>
                    </tr>
                    
                    {/* رابط عدد العملاء المتفاعلين أو الخاضعين للمنشور ويأخذك لتبويتة العملاء في شريط التعديل */}
                    <tr>
                      <td style={fieldLabelStyle}>العملاء (Customers)</td>
                      <td style={fieldValueStyle}>
                        <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`, { state: { tab: 'customers' } }) }}
                          style={{ color: TEAL, fontWeight: 'bold' }}>{pub.customersCount || 0}</a>
                      </td>
                    </tr>
                    
                    {/* رابط عدد المستندات المجمعة داخله ويأخذك لتبويتة المستندات في الدخول المفصل */}
                    <tr>
                      <td style={fieldLabelStyle}>المستندات (Documents)</td>
                      <td style={fieldValueStyle}>
                        <a href="#" onClick={e => { e.preventDefault(); navigate(`/publications/${pub.id}/edit`, { state: { tab: 'documents' } }) }}
                          style={{ color: TEAL, fontWeight: 'bold' }}>{pub.docsCount || 0}</a>
                      </td>
                    </tr>
                    
                    {/* صف عرض تاريخ الإضافة */}
                    <tr>
                      <td style={fieldLabelStyle}>تاريخ الإضافة (Date Added)</td>
                      <td style={fieldValueStyle}>{pub.createdAt || '—'}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>

              {/* رصيف العمليات لكل عنصر منشور فردي (قائمة الأيقونات السريعة أقصى اليسار) */}
              <div className="mobile-card-actions" style={{ display: 'flex', gap: 6, padding: '8px 12px', alignItems: 'flex-start', background: '#fff' }}>
                {/* زر التعديل (يأخذك لنموذج تعديل المنشور) */}
                <ActionIcon icon="bi-pencil-fill" color={TEAL} title="تعديل (Edit)"
                  onClick={() => navigate(`/publications/${pub.id}/edit`)} />
                {/* زر الحذف الفردي (يسأل عن التأكيد أولاً عبر الـ State) */}
                <ActionIcon icon="bi-x" color="#f44336" title="حذف (Delete)" bold={true}
                  onClick={() => handleDelete(pub.id)} />
                {/* أيقونة التفاصيل التي اعتمدناها لمعاملة التفصيل الافتراضية (التوجيه لصفحة التعديل كاملة) */}
                <ActionIcon icon="bi-chevron-double-left" color="#fff" bg={TEAL} title="التفاصيل (Details)" 
                  onClick={() => navigate(`/publications/${pub.id}/edit`)} />
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
    </div>
  )
}

// مكون (Component) صغير وقابل لإعادة الاستخدام لرسم أزرار الأيقونات بكود أنظف ومقروء
const ActionIcon = ({ icon, color, bg = 'transparent', bold = false, title, onClick }) => (
  // الغلاف الخارجي عبارة عن زر
  <button onClick={onClick} title={title}
    // تخصيص الأنماط للأيقونات المدورة والحواف والألوان والتمرير المرئي
    style={{
      background: bg, color: color, border: bg === 'transparent' ? `2px solid ${color}` : 'none',
      borderRadius: '50%', width: 24, height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 14, padding: 0,
      fontWeight: bold ? 900 : 'normal'
    }}>
    {/* استدعاء صنف الأيقونة عبر مكتبة بوتستراب مثلا */}
    <i className={`bi ${icon}`} />
  </button>
)

export default PublicationsListPage
