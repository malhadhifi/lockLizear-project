/**
 * ملف: EditPublicationPage.jsx
 * الوظيفة: تعديل تفاصيل وإعدادات المنشور (Edit Publication)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - هذه الصفحة مسؤولة عن تعديل المنشورات الموجودة.
 * - واجهة المستخدم مطابقة لتصميم V5 وبها نظام تبويبات (Tabs).
 * - التبويبات المتوفرة: تفاصيل المنشور، المستندات المجمعة، والعملاء المشتركون.
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل تماماً.
 */

// استيراد خطافات دورة حياة المكون وإدارة الحالة
import { useState, useEffect } from 'react'
// استيراد أدوات التوجيه لجلب المعرفات (Params) والمسارات الحالية
import { useNavigate, useParams, useLocation } from 'react-router-dom'
// استيراد خطافات الباك إند من React Query
import { usePublicationDetails, useUpdatePublication } from '../hooks/usePublications'
// استيراد المكونات الفرعية التي ستُعرض داخل التبويبات الأخرى
import PublicationAccessList from '../components/PublicationAccessList'
import PublicationDocumentsList from '../components/PublicationDocumentsList'
import DocumentSelector from '../components/DocumentSelector'
// استيراد أداة التنبيهات المنبثقة لإظهار رسائل النجاح
import toast from 'react-hot-toast'

// تعريف اللون الأساسي للهوية المعتمدة (Teal) المستخلص من LockLizard
const TEAL = '#009cad'

// المكون الرئيسي لصفحة تعديل المنشورات
const EditPublicationPage = () => {
  // جلب معرّف (ID) المنشور من الرابط (URL) للتعرف عليه
  const { id } = useParams()
  // تفعيل أداة التوجيه البرمجي للانتقال بين الصفحات
  const navigate = useNavigate()
  // تفعيل أداة قراءة حالة الرابط لمعرفة التبويبة المطلوبة (إن وجدت)
  const location = useLocation()
  // تفعيل خطافات React Query لجلب معلومات المنشور وتحديثه
  const { data: pubData, isLoading } = usePublicationDetails(id)
  const updateMutation = useUpdatePublication()
  
  // استخراج بيانات المنشور من الرد الخادم
  const publication = pubData?.data

  // تحديد التبويبة الافتراضية (إما ممررة عبر الرابط أو التبويبة الأولى 'details')
  const initialTab = location.state?.tab || 'details'
  // حالة (State) لحفظ التبويبة النشطة حالياً
  const [activeTab, setActiveTab] = useState(initialTab)
  
  // حالة (State) لفتح وإغلاق نافذة إضافة مستند جديد
  const [showDocSelector, setShowDocSelector] = useState(false)

  // حالة (State) لحفظ اسم المنشور مع وضع القيمة الحالية كقيمة مبدئية
  const [name, setName] = useState('')
  // حالة (State) لحفظ الوصف مع وضع القيمة الحالية كقيمة مبدئية
  const [description, setDescription] = useState('')
  // حالة (State) لحفظ خانة الاختيار مع وضع القيمة الحالية كقيمة مبدئية
  const [obeyStartDate, setObeyStartDate] = useState(false)

  // مزامنة البيانات المتلقاة من الخادم مع حالة المتغيرات المحلية
  useEffect(() => {
    if (publication) {
      setName(publication.name || '')
      setDescription(publication.description || '')
      setObeyStartDate(publication.obey || false)
    }
  }, [publication])

  // أثناء عملية الجلب والتحميل، يظهر مؤشر تحميل احترافي
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 100, color: TEAL, fontSize: 18 }}>جارٍ جلب تفاصيل المنشور... ⏳</div>
  }

  // إذا لم يتم العثور على المنشور (صفحة غير موجودة)، عرض رسالة خطأ مع زر العودة
  if (!publication) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        {/* رسالة توضيحية بعدم وجود المنشور */}
        <p style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>المنشور غير موجود (Publication not found)</p>
        <button onClick={() => navigate('/publications')}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
          العودة لقائمة المنشورات (Back to List)
        </button>
      </div>
    )
  }

  // الدالة التي يتم استدعاؤها عند الضغط على زر "حفظ" (Save) للنموذج
  const handleSave = () => {
    // التأكد من أن الاسم ليس فارغاً
    if (!name.trim()) return
    // إرسال الإجراء إلى الباك إند عبر React Query
    updateMutation.mutate({ 
      id: publication.id, 
      name, 
      description, 
      obey: obeyStartDate 
    })
  }

  // مصفوفة قائمة التبويبات المعروضة بترتيبها واسمائها وعدد العناصر المرافق
  const tabs = [
    { key: 'details', label: 'تعديل المنشور (Edit Publication)' },
    { key: 'documents', label: `المستندات (Documents) (${publication.docsCount})` },
    { key: 'customers', label: `العملاء (Customers) (${publication.customersCount})` },
  ]

  // === بداية رسم واجهة المستخدم (Render) ===
  return (
    // الحاوية الأساسية للصفحة ممتدة لتغطي المساحة المتاحة
    <div style={{ minHeight: 'calc(100vh - 100px)', padding: '0 10px' }}>
      
      {/* الغلاف الرئيسي لصفحة التعديل بتصميم بطاقة عريضة تشبه شاشات النظام */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', border: `1px solid #ccc` }}>
        
        {/* === الترويسة الرئيسية الخاصة بـ LockLizard باللون الـ Teal === */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* اسم الشاشة معرّف باسم المنشور الفعلي */}
          <span>إدارة المنشور (Manage Publication): {publication.name}</span>
          {/* زر التراجع للقائمة السابقة */}
          <button type="button" onClick={() => navigate('/publications')}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: 12, cursor: 'pointer' }}>
            ← رجوع (Back)
          </button>
        </div>

        {/* === شريط التبويبات (Tabs Bar) الكلاسيكي === */}
        <div style={{ display: 'flex', background: '#f8f8f8', borderBottom: '1px solid #ccc' }}>
          
          {/* تدوير (Map) لرسم جميع أزرار التبويبات بشكل منفصل */}
          {tabs.map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              // التنسيق المتغير بناءً على حالة النشاط (لون الخلفية والحدود)
              style={{
                padding: '12px 24px', fontSize: 13, fontWeight: 700,
                background: activeTab === tab.key ? '#fff' : 'transparent',
                border: 'none',
                borderRight: '1px solid #ccc',
                borderLeft: 'none',
                borderBottom: activeTab === tab.key ? '1px solid #fff' : 'none',
                // الخط العلوي البارز بلون التيل عند التنشيط
                borderTop: activeTab === tab.key ? `3px solid ${TEAL}` : '3px solid transparent',
                color: activeTab === tab.key ? TEAL : '#555',
                cursor: 'pointer', outline: 'none',
                position: 'relative', top: activeTab === tab.key ? 1 : 0
              }}>
              {/* النص المعروض داخل التبويبة */}
              {tab.label}
            </button>
          ))}
          {/* جزء التكملة لتعميم الخط السفلي على امتداد الشاشة */}
          <div style={{ flex: 1 }}></div>
        </div>

        {/* === منطقة عرض المحتوى للتبويبة النشطة فقط === */}
        <div style={{ background: '#fff', minHeight: 400 }}>

          {/* التبويبة 1: التفاصيل الأساسية للمنشور (تفصيل طولي للبيانات) */}
          {activeTab === 'details' && (
            <div style={{ padding: '24px 30px' }}>
              
              {/* شريط رمادي كلاسيكي يفصل العنوان عن الحقول */}
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                تعديل القواعد والنصوص (Edit Details)
              </div>

              {/* حاوية النموذج للمباعدة وتحديد العرض */}
              <div style={{ maxWidth: 800 }}>
                
                {/* صف إدخال "الاسم" مع تنسيق شبكي للمحاذاة */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  {/* الكلمة الدلالية (اليمين) */}
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>
                    الاسم (Name)
                  </label>
                  <div style={{ flex: 1 }}>
                    {/* حقل الإدخال النصي مع ربطه بمتغير الاسم */}
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      maxLength={64} style={{ width: '100%', maxWidth: 350, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13 }} />
                  </div>
                </div>

                {/* صف إدخال "الوصف" متعدد الأسطر */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  {/* الكلمة الدلالية (اليمين) */}
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>
                    الوصف (Description)
                  </label>
                  <div style={{ flex: 1 }}>
                    {/* حقل الوصف المكون من 3 أسطر على الأقل */}
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      rows={4} style={{ width: '100%', maxWidth: 450, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, resize: 'vertical' }} />
                  </div>
                </div>

                {/* صف مفتاح الخيار (Checkbox) للالتزام بتواريخ البدء */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, paddingRight: 140 }}>
                  <input type="checkbox" checked={obeyStartDate} onChange={e => setObeyStartDate(e.target.checked)} id="obeyEdit" style={{ marginLeft: 8 }} />
                  {/* الرابط النصي القابل للنقر بصيغة ثنائية اللغة */}
                  <label htmlFor="obeyEdit" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#333' }}>
                    الالتزام بتاريخ بدء العميل (Obey customer start date)
                  </label>
                </div>

                {/* خط فاصل رمادي أنيق بين الحقول والأزرار */}
                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

                {/* صف حاوية الأزرار السفلية بمحاذاة اليمين */}
                <div style={{ display: 'flex', gap: 12, paddingRight: 140 }}>
                  {/* زر החفظ الأساسي بلون التيل */}
                  <button type="button" onClick={handleSave} disabled={!name.trim()}
                    style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: !name.trim() ? 0.5 : 1 }}>
                    حفظ (Save)
                  </button>
                  {/* زر التراجع الفاتح اللون الرمادي */}
                  <button type="button" onClick={() => navigate('/publications')}
                    style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 2, padding: '8px 30px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    إلغاء (Cancel)
                  </button>
                </div>
              </div>

              {/* قسم "מעיداءات النظام" المخصص للقراءة فقط والمرفق بكل سجل أمان */}
              <div style={{ marginTop: 40, padding: '16px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 3, fontSize: 13, maxWidth: 800 }}>
                {/* عنوان قسم المعلومات */}
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, color: TEAL }}>معلومات النظام الآلية (System Information):</h4>
                {/* جدول الخواص التلقائي ذو التنسيق الشبكي الواضح */}
                <table style={{ lineHeight: 1.8 }}>
                  <tbody>
                    {/* عرضالمعرف غير القابل للتعديل */}
                    <tr><td style={flStyle}>معرف المنشور (ID):</td><td style={{ color: '#000' }}>{publication.id}</td></tr>
                    {/* عرض كاونتر العملاء غير القابل للتعديل */}
                    <tr><td style={flStyle}>عدد العملاء (Customers):</td><td style={{ color: '#000' }}>{publication.customersCount}</td></tr>
                    {/* عرض كاونتر المستندات المتضمنة */}
                    <tr><td style={flStyle}>عدد المستندات (Documents):</td><td style={{ color: '#000' }}>{publication.docsCount}</td></tr>
                    {/* عرض تاريخ نشأة المنشور بالصيغة الأساسية */}
                    <tr><td style={flStyle}>تاريخ الإنشاء (Created At):</td><td style={{ color: '#000' }}>{publication.createdAt}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* التبويبة 2: شاشة المستندات المدرجة المربوطة بمكونات (Components) خارجية */}
          {activeTab === 'documents' && (
            <div style={{ padding: '20px' }}>
              {/* استدعاء مكون لائحة المستندات الخاصة بالمنشور وتمرير دالة فتح نافذة إضافة مستند جديد */}
              <PublicationDocumentsList publicationId={id} onAddDocument={() => setShowDocSelector(true)} />
              {/* استدعاء المودال (النافذة المنبثقة) لاختيار المستندات ليظهر فقط حين النقر */}
              <DocumentSelector isOpen={showDocSelector} onClose={() => setShowDocSelector(false)}
                existingDocIds={[1, 2, 4]} onDocumentsAdded={() => {}} />
            </div>
          )}

          {/* التبويبة 3: شاشة العملاء المعرفين بالوصول للمنشور */}
          {activeTab === 'customers' && (
            <div style={{ padding: '20px' }}>
               {/* استدعاء مكون قائمة عملاء الاستحقاق الخاص بالمنشور بالذات */}
               <PublicationAccessList publicationId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// تنسيق دلالات الاستعراض لجدول الخصائص لتجنب تكرار كتاية الستايل في الأسطر
const flStyle = { fontWeight: 700, paddingLeft: 24, paddingRight: 8, color: '#555', width: 250 }

export default EditPublicationPage
