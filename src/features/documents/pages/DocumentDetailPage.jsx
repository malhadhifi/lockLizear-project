/**
 * ملف: DocumentDetailPage.jsx
 * الوظيفة: تفاصيل وإعدادات المستند (Document Details)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - واجهة مخصصة لعرض تفاصيل مستند معين وتعديل بياناته المرنة (كالوصف وتاريخ الانتهاء).
 * - مبنية بنظام التبويبات (Tabs) الكلاسيكي تماماً كصفحة (تعديل منشور Edit Publication).
 * - تعرض (تفاصيل المستند، قواعد الـ DRM الثابتة المرفوعة من الكاتب، والعملاء/المنشورات المربوطة).
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل تماماً.
 */

// استيراد خطاف (Hook) إدارة الحالة المؤقتة والتأثيرات من مكتبة React
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// استيراد أدوات التوجيه لجلب المعرفات (Params) والمسارات الحالية للروابط
import { useNavigate, useParams, useLocation } from 'react-router-dom'
// استيراد أداة التنبيهات المنبثقة لإظهار الإشعارات الشفافة بنجاح العمليات
import toast from 'react-hot-toast'
// استيراد إجراء حفظ تعديلات المستند من شريحة المستندات في حسابات Redux
import { updateDocument } from '../store/documentsSlice'

// تعريف اللون الأساسي (Teal) المعتمد في هوية LockLizard لتوحيد الواجهات
const TEAL = '#009cad'

// المكون الأساسي لصفحة عرض وتعديل تفاصيل المستند
const DocumentDetailPage = () => {
  // استخراج معرّف (ID) المستند من رابط الصفحة الحالي وتحويله لرقم
  const idParam = parseInt(useParams().id, 10)
  // تفعيل الدالة الخاصة بالانتقال بين الصفحات برمجياً (Navigate)
  const navigate = useNavigate()
  // أداة قراءة حالة الرابط لمعرفة التبويبة المطلوبة افتراضياً إن تم تمريرها
  const location = useLocation()
  
  // أداة إرسال الحزم للـ Redux (Dispatch)
  const dispatch = useDispatch()
  
  // الاستماع لحالة (State) قائمة المستندات من متجر الـ Redux
  const documents = useSelector(state => state.documents.list)
  // البحث عن المستند المطلوب استناداً للرقم المعرف في الرابط
  const document = documents.find(doc => doc.id === idParam)

  // تحديد التبويبة الافتراضية للبداية (إما مجلوبة من الرابط أو التبويبة الأولى 'details')
  const initialTab = location.state?.tab || 'details'
  // حالة (State) متغيرة لحفظ التبويبة النشطة حالياً
  const [activeTab, setActiveTab] = useState(initialTab)

  // حالات (States) لحفظ بيانات المستند القابلة للتعديل
  const [description, setDescription] = useState(document?.description || '')
  const [expires, setExpires] = useState(document?.expires || '')
  // حالة (State) لتتبع ما إذا كان المستند موقوفاً أو مفصلاً للمستخدم
  const [isSuspended, setIsSuspended] = useState(document?.status === 'suspended')

  // تحديث الحالات المحلية إذا تم تغيير المستند (مثل العودة وتحديث الصفحة)
  useEffect(() => {
    if (document) {
      setDescription(document.description || '')
      setExpires(document.expires || '')
      setIsSuspended(document.status === 'suspended')
    }
  }, [document])

  // التحقق في حال لم يتم العثور على المستند بعد استخراج المعرف
  if (!document) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        {/* رسالة توضيحية بعدم وجود المستند */}
        <p style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>المستند غير موجود (Document not found)</p>
        <button onClick={() => navigate('/documents')}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
          العودة لقائمة المستندات (Back to List)
        </button>
      </div>
    )
  }

  // الدالة التي يتم استدعاؤها لحفظ التعديلات في متجر Redux
  const handleSave = () => {
    // إرسال البيانات المحدثة لشريحة الريدكس
    dispatch(updateDocument({
      id: document.id,
      description,
      expires,
      status: isSuspended ? 'suspended' : 'valid'
    }))
    // إظهار رسالة الخادم التخيلية للتأكيد
    toast.success('تم تحديث تفاصيل المستند بنجاح! (Document Updated)')
  }

  // مصفوفة تبويبات الصفحة مع تخصيص العدادات الرقمية داخل العناوين
  const tabs = [
    { key: 'details', label: 'تعديل المستند (Edit Document)' },
    { key: 'drm', label: 'قواعد الحماية (DRM Controls)' },
    { key: 'access', label: `العملاء/المنشورات (${document.customersCount})` },
  ]

  // === بداية رسم واجهة المستخدم الحقيقية (Render) ===
  return (
    // الحاوية الأساسية للصفحة ممتدة لتغطي المساحة المتاحة، مع إعطاء مسافة طفيفة
    <div style={{ minHeight: 'calc(100vh - 100px)', padding: '0 10px' }}>
      
      {/* الغلاف الرئيسي لصفحة التعديل بتصميم بطاقة عريضة تشبه شاشات النظام السابقة */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', border: `1px solid #ccc` }}>
        
        {/* === الترويسة الرئيسية الخاصة بـ LockLizard باللون الـ Teal === */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* اسم الشاشة معرّف باسم المستند كعنوان ثابت في الترسيخة */}
          <span>إدارة المستند (Manage Document): {document.name}</span>
          {/* زر التراجع للقائمة السابقة مع تأثير شفاف وتخفيف الحدود */}
          <button type="button" onClick={() => navigate('/documents')}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: 12, cursor: 'pointer' }}>
            ← رجوع (Back)
          </button>
        </div>

        {/* === شريط التبويبات (Tabs Bar) الكلاسيكي المرادف لمنهجية عرض لوحة LockLizard === */}
        <div style={{ display: 'flex', background: '#f8f8f8', borderBottom: '1px solid #ccc' }}>
          
          {/* رسم التبويبات بحلقة (Map) برمجية بسيطة */}
          {tabs.map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              // التنسيق المتغير (Dynamic Style) بناءً على التنشيط لرفع التبويبة وصبغ الحافة بالـ Teal
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
                position: 'relative', top: activeTab === tab.key ? 1 : 0
              }}>
              {tab.label}
            </button>
          ))}
          {/* جزء لتكملة الخط الرمادي السفلي ليمتد على كامل الشاشة يميناً ويساراً */}
          <div style={{ flex: 1 }}></div>
        </div>

        {/* === منطقة عرض المحتوى (Tab Content) بناءً على ما اختاره المستخدم === */}
        <div style={{ background: '#fff', minHeight: 450 }}>

          {/* === التبويبة 1: التفاصيل الأساسية للمستند وإعداداته === */}
          {activeTab === 'details' && (
            <div style={{ padding: '24px 30px' }}>
              
              {/* شريط رمادي كلاسيكي يعتلي الحقول للدلالة على فئتها */}
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                معلومات عامة (General Information)
              </div>

              {/* حاوية النموذج لتحديد عرض متناسق */}
              <div style={{ maxWidth: 800 }}>
                
                {/* صف العرض الثابت "للاسم" (عادة لا يمكن تعديل اسم المستند من لوحة التحكم، بل يُرفع جاهزاً من الناشر) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111' }}>الاسم (Name)</label>
                  <div style={{ flex: 1, color: '#000', fontWeight: 600, fontSize: 14 }}>
                    {document.name}
                  </div>
                </div>

                {/* صف التعديل لـ "الوصف" ليتمكن مدير النظام من إرفاق ملاحظات إضافية */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>الوصف (Description)</label>
                  <div style={{ flex: 1 }}>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      rows={3} style={{ width: '100%', maxWidth: 450, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, resize: 'vertical' }} />
                  </div>
                </div>

                {/* صف تعديل "تاريخ الانتهاء" (من أهم الصلاحيات التي يمكن تعديلها من المخدم) */}
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

                {/* صف صندوق الإيقاف الجبري (Suspend) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, paddingRight: 140 }}>
                  <input type="checkbox" checked={isSuspended} onChange={e => setIsSuspended(e.target.checked)} id="suspendDoc" style={{ marginLeft: 8 }} />
                  <label htmlFor="suspendDoc" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#d32f2f' }}>
                    تجميد المستند وإيقاف القراءة (Suspend Document)
                  </label>
                </div>

                {/* خط فاصل رمادي يفصل بين الحقول وأزرار التنفيذ */}
                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

                {/* صف الأزرار (حفظ وإلغاء) مصفوفة على خط واحد */}
                <div style={{ display: 'flex', gap: 12, paddingRight: 140 }}>
                  <button type="button" onClick={handleSave}
                    style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    حفظ (Save)
                  </button>
                  <button type="button" onClick={() => navigate('/documents')}
                    style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 2, padding: '8px 30px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    إلغاء (Cancel)
                  </button>
                </div>
              </div>

              {/* قسم "معلومات النظام" الثابتة (للقراءة فقط) لعرض إحصاءات المستند */}
              <div style={{ marginTop: 40, padding: '16px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 3, fontSize: 13, maxWidth: 800 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, color: TEAL }}>معلومات النظام (System Details):</h4>
                <table style={{ lineHeight: 1.8 }}>
                  <tbody>
                    {/* المعرف الأساسي في قاعدة البيانات */}
                    <tr><td style={flStyle}>معرف المستند (ID):</td><td style={{ color: '#000' }}>{document.id}</td></tr>
                    {/* تاريخ النشر الأصلي عندما رُفع من برنامج الكاتب */}
                    <tr><td style={flStyle}>تاريخ النشر (Published):</td><td style={{ color: '#000' }}>{document.publishedDate}</td></tr>
                    {/* عدد العملاء والمنشورات المدمج بها لتوضيح مدى انتشاره */}
                    <tr><td style={flStyle}>المسجلين (Registered):</td><td style={{ color: '#000' }}>{document.customersCount} عميل مُصرح، و {document.publicationsCount} منشور مرتبط.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === التبويبة 2: قواعد الحماية المرفوعة (DRM Controls) === */}
          {/* ملاحظة: قواعد الحماية تُعرض للقراءة فقط لكونها مجهزة وموقعة من طرف الناشر الأصلي */}
          {activeTab === 'drm' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                إعدادات حماية المستند (DRM Settings - Read Only)
              </div>
              
              <div style={{ maxWidth: 800 }}>
                {/* عرض رسالة توضيحية خفيفة */}
                <p style={{ fontSize: 13, color: '#666', marginBottom: 20, fontStyle: 'italic' }}>
                  هذه الخصائص تم تحديدها أثناء نشر المستند بواسطة برنامج الكاتب (Writer) ولا يمكن تعديلها من لوحة الإدارة للحفاظ على التوقيع الرقمي.
                </p>

                {/* جدول الخواص لعرض ما إذا كان مطبوعاً أو محمي وغيرها */}
                <table style={{ fontSize: 13, lineHeight: '2.4', width: '100%', maxWidth: 500 }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600, width: '60%', borderBottom: '1px solid #eee' }}>السماح بالطباعة (Allow Printing)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.drm?.printingEnabled ? '✅ نعم' : '❌ لا'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>علامة مائية للقراءة (Viewing Watermark)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.drm?.viewingWatermark ? '✅ مُفعّلة' : '❌ غير مُفعّلة'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>علامة مائية للطباعة (Printing Watermark)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.drm?.printingWatermark ? '✅ مُفعّلة' : '❌ لا تنطبق'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>الربط بالجهاز (Lock to Device)</td>
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.drm?.lockToDevice ? '✅ مقيّد' : '❌ غير مقيّد'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>تتبع الاستخدام (Track Usage)</td>
                      <td>{document.drm?.trackUsage ? '✅ نعم' : '❌ لا'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === التبويبة 3: إدارة وصول العملاء (Customers Access) === */}
          {/* في المستقبل سيتم ربط هذا القسم مع مكون لعرض العملاء واستدعاء المودل (Modal) لإضافة الصلاحيات */}
          {activeTab === 'access' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                وصول العملاء والمنشورات المدمجة (Access & Distribution)
              </div>
              <p style={{ fontSize: 13, color: '#555' }}>
                * ملاحظة: يتم هنا عرض قائمة بالعملاء الذين أُعطوا حق الوصول المباشر لهذا المستند.
                <br />
                (المكون الخاص بالجدول سيتم ربطه لاحقاً).
              </p>
              
              {/* زر إضافي لمنح الوصول يدوياً */}
              <button type="button" onClick={() => toast('سيتم فتح نافذة اختيار العملاء (Select Customers Modal) لمطابقة سلوك LockLizard.')}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '8px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>
                + إضافة وصول للعميل (Grant Access)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// تنسيقات دلالات الاستعراض لجدول معلومات النظام لتنظيف الـ HTML
const flStyle = { fontWeight: 700, paddingLeft: 24, paddingRight: 8, color: '#555', width: 180 }

// تصدير واجهة إدارة تفاصيل المستندات ليستقبلها موزع الصفحات الأساسي في التطبيق
export default DocumentDetailPage
