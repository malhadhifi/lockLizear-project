/**
 * ملف: DocumentDetailPage.jsx
 * الوظيفة: تفاصيل وإعدادات المستند (Document Details)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - واجهة مخصصة لعرض تفاصيل مستند معين وتعديل بياناته المرنة (كالوصف وتاريخ الانتهاء).
 * - مبنية بنظام التبويبات (Tabs) الكلاسيكي تماماً كصفحة (تعديل منشور Edit Publication).
 * - تعرض (تفاصيل المستند، إعدادات الأمان والحماية، والعملاء/المنشورات المربوطة).
 * - تم تحديث أسماء الحقول لتطابق ما يرسله الباك إند فعلياً عبر API.
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل تماماً.
 */

// استيراد خطاف (Hook) إدارة الحالة المؤقتة والتأثيرات من مكتبة React
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// استيراد أدوات التوجيه لجلب المعرفات (Params) والمسارات الحالية للروابط
import { useNavigate, useParams, useLocation } from 'react-router-dom'
// استيراد أداة التنبيهات المنبثقة لإظهار الإشعارات الشفافة بنجاح العملياتimport toast from 'react-hot-toast'
// ✅ استيراد إجراءات Redux الحقيقية:
// fetchDocumentById: جلب مستند واحد بكامل تفاصيله من API
// updateDocument: حفظ التعديلات عبر API (PATCH)
// clearCurrentDocument: تنظيف currentDocument عند مغادرة الصفحة
import {
  fetchDocumentById,
  updateDocument,
  clearCurrentDocument,
} from '../store/documentsSlice'

// تعريف اللون الأساسي (Teal) المعتمد في هوية LockLizard لتوحيد الواجهاجonst TEAL = '#009cad'

// المكون الأساسي لصفحة عرض وتعديل تفاصيل المستندconst DocumentDetailPage = () => {
  // ✅ استخراج معرّف (ID) المستند من رابط الصفحة الحالي وتحويله لرقم
  const idParam = parseInt(useParams().id, 10)
  // تفعيل الدالة الخاصة بالانتقال بين الصفحات برمجياً (Navigate)
  const navigate = useNavigate()
  // أداة قراءة حالة الرابط لمعرفة التبويبة المطلوبة افتراضياً إن تم تمريرها
  const location = useLocation()
  // أداة إرسال الحزم للـ Redux (Dispatch)
  const dispatch = useDispatch()

  // ✅ قراءة currentDocument من متجر Redux بدل من البحث في list
  // detailLoading: true عند جلب المستند من السيرفر
  // detailError: رسالة الخطأ إن فشل الطلب
  const {
    currentDocument: document,
    detailLoading,
    detailError,
  } = useSelector(state => state.documents)

  // تحديد التبويبة الافتراضية للبداية (إما مجلوبة من الرابط أو التبويبة الأولى 'details')
  const initialTab = location.state?.tab || 'details'
  // حالة (State) متغيرة لحفظ التبويبة النشطة حالياً
  const [activeTab, setActiveTab] = useState(initialTab)

  // حالات (States) لحفظ بيانات المستند القابلة للتعديل
  const [description, setDescription] = useState('')
  // ✅ الحقل الصحيح: expired وليس expires
  const [expires, setExpires] = useState('')
  // حالة (State) لتتبع ما إذا كان المستند موقوفاً أو مفصلاً للمستخدم
  const [isSuspended, setIsSuspended] = useState(false)

  // ✅ useEffect #1: جلب بيانات المستند من API عند تحميل الصفحة
  // - يعمل كل ما تغيّر idParam (بمعنى فتح مستند جديد)
  // - عند مغادرة الصفحة (cleanup) ينظف currentDocument لتجنب عرض بيانات قديمة
  useEffect(() => {
    dispatch(fetchDocumentById(idParam))
    return () => {
      dispatch(clearCurrentDocument())
    }
  }, [dispatch, idParam])

  // ✅ useEffect #2: تحديث الحالات المحلية بعد جلب البيانات من السيرفر
  // - يجري فقط عند تغيُّر المستند في Redux (تحميل أو بعد حفظ)
  useEffect(() => {
    if (document) {
      setDescription(document.description || '')
      // ✅ اسم الحقل الحقيقي من الباك إند هو: expired وليس expires
      setExpires(document.expired || '')
      setIsSuspended(document.status === 'suspended')
    }
  }, [document])

  // ✅ حالة التحميل: عرض مؤشر تحميل جميل بدل من صفحة فارغة
  if (detailLoading && !document) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        <div style={{ color: TEAL, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
          جاري تحميل تفاصيل المستند...
        </div>
        <div style={{ width: 36, height: 36, border: `4px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ✅ حالة الخطأ: عرض رسالة واضحة مع زر "إعادة المحاولة" بدل من صفحة بيضاء
  if (detailError && !document) {
    return (
      <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '1px solid #ddd', borderRadius: 4, margin: 20 }}>
        {/* رسالة خطأ تفصيلية تساعد المطور على تشخيص المشكلة */}
        <p style={{ color: '#d32f2f', fontSize: 16, marginBottom: 20 }}>⚠️ {detailError}</p>
        {/* زر إعادة المحاولة يعيد طلب fetchDocumentById مباشرةً */}
        <button onClick={() => dispatch(fetchDocumentById(idParam))}
          style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, marginLeft: 10 }}>
          إعادة المحاولة (Retry)
        </button>
        {/* زر العودة لقائمة المستندات بدون تحميل مجدد */}
        <button onClick={() => navigate('/documents')}
          style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 3, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
          العودة للقائمة (Back to List)
        </button>
      </div>
    )
  }

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

  // ✅ دالة حفظ التعديلات عبر API حقيقي (PATCH) بدل dispatch محلي
  const handleSave = async () => {
    try {
      // إرسال البيانات المحدثة عبر updateDocument AsyncThunk
      await dispatch(
        updateDocument({
          id: document.id,
          data: {
            description,
            // ✅ اسم الحقل عند الباك إند: expired
            expired: expires || null,
            status: isSuspended ? 'suspended' : 'valid',
          },
        })
      ).unwrap()
      // إظهار رسالة نجاح حقيقية بعد نجاح الطلب
      toast.success('تم تحديث تفاصيل المستند بنجاح! (Document Updated)')
    } catch (error) {
      // عرض رسالة خطأ مفصلة عند فشل طلب الحفظ
      toast.error(error || 'فشل تحديث المستند (Update Failed)')
    }
  }

  // ✅ مصفوفة تبويبات الصفحة مع تخصيص العدادات الرقمية داخل العناوين
  const tabs = [
    { key: 'details', label: 'تعديل المستند (Edit Document)' },
    // التبويبة الثانية تعرض إعدادات الأمان (من حقل security الحقيقي)
    { key: 'drm', label: 'إعدادات الحماية (Security Settings)' },
    // ✅ اسم الحقل الحقيقي من الباك إند: customers_count وليس customersCount
    { key: 'access', label: `العملاء/المنشورات (${document.customers_count ?? 0})` },
  ]

  // === بداية رسم واجهة المستخدم الحقيقية (Render) ===
  return (
    // الحاوية الأساسية للصفحة ممتدة لتغطية المساحة المتاحة، مع إعطاء مسافة طفيفة
    <div style={{ minHeight: 'calc(100vh - 100px)', padding: '0 10px' }}>

      {/* الغلاف الرئيسي لصفحة التعديل بتصميم بطاقة عريضة تشبه شاشات النظام السابقة */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', border: '1px solid #ccc' }}>

        {/* === الترويسة الرئيسية الخاصة بـ LockLizard باللون الـ Teal === */}
        <div style={{
          background: TEAL, color: '#fff', padding: '10px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* ✅ اسم الشاشة معرّف باسم المستند الحقيقي (title وليس name) */}
          <span>إدارة المستند (Manage Document): {document.title}</span>
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
                position: 'relative', top: activeTab === tab.key ? 1 : 0,
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

                {/* ✅ صف عرض العنوان (title) - الحقل الحقيقي من الباك إند: title وليس name */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111' }}>العنوان (Title)</label>
                  <div style={{ flex: 1, color: '#000', fontWeight: 600, fontSize: 14 }}>
                    {document.title}
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

                {/* ✅ صف تعديل "تاريخ الانتهاء" - الحقل الحقيقي من الباك إند: expired وليس expires */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111' }}>انتهاء المستند (Expires)</label>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="date" value={expires} onChange={e => setExpires(e.target.value)}
                      style={{ border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, minWidth: 150 }} />
                    {/* زر مسح التاريخ لتعيين مستند بلا انتهاء أبدي */}
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

                {/* ✅ صف الأزرار (حفظ وإلغاء) - زر الحفظ الآن يرسل لـ API حقيقي */}
                <div style={{ display: 'flex', gap: 12, paddingRight: 140 }}>
                  <button type="button" onClick={handleSave} disabled={detailLoading}
                    style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 2, padding: '8px 30px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: detailLoading ? 0.6 : 1 }}>
                    {/* ✅ عرض مؤشر التحميل على الزر أثناء إرسال طلب التحديث */}
                    {detailLoading ? 'جاري الحفظ...' : 'حفظ (Save)'}
                  </button>
                  <button type="button" onClick={() => navigate('/documents')}
                    style={{ background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: 2, padding: '8px 30px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    إلغاء (Cancel)
                  </button>
                </div>
              </div>

              {/* ✅ قسم "معلومات النظام" الثابتة (للقراءة فقط) لعرض إحصائيات المستند */}
              <div style={{ marginTop: 40, padding: '16px 20px', background: '#fafafa', border: '1px solid #eee', borderRadius: 3, fontSize: 13, maxWidth: 800 }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: 14, color: TEAL }}>معلومات النظام (System Details):</h4>
                <table style={{ lineHeight: 1.8 }}>
                  <tbody>
                    {/* المعرف الأساسي في قاعدة البيانات */}
                    <tr>
                      <td style={flStyle}>معرف المستند (ID):</td>
                      <td style={{ color: '#000' }}>{document.id}</td>
                    </tr>
                    {/* ✅ تاريخ النشر - اسم الحقل الحقيقي: published وليس publishedDate */}
                    <tr>
                      <td style={flStyle}>تاريخ النشر (Published):</td>
                      <td style={{ color: '#000' }}>{document.published}</td>
                    </tr>
                    {/* ✅ عدد العملاء - اسم الحقل الحقيقي: customers_count وليس customersCount */}
                    {/* ✅ عدد المنشورات - اسم الحقل الحقيقي: publications_count وليس publicationsCount */}
                    <tr>
                      <td style={flStyle}>المسجلين (Registered):</td>
                      <td style={{ color: '#000' }}>
                        {document.customers_count ?? 0} عميل مُصرح، و {document.publications_count ?? 0} منشور مرتبط.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === التبويبة 2: إعدادات الأمان === */}
          {/* ✅ تعرض بيانات من حقل security الحقيقي وليس drm */}
          {activeTab === 'drm' && (
            <div style={{ padding: '24px 30px' }}>
              <div style={{ background: '#f5f5f5', color: '#333', padding: '8px 16px', fontWeight: 700, fontSize: 13, border: '1px solid #ddd', marginBottom: 20 }}>
                إعدادات حماية المستند (Security Settings - Read Only)
              </div>

              <div style={{ maxWidth: 800 }}>
                {/* رسالة توضيحية خفيفة لتوضيح طبيعة هذه البيانات */}
                <p style={{ fontSize: 13, color: '#666', marginBottom: 20, fontStyle: 'italic' }}>
                  هذه الخصائص تم تحديدها من طرف الناشر ولا يمكن تعديلها من لوحة الإدارة.
                </p>

                {/* ✅ جدول خواص من حقل security (expiry_mode, verify_mode, max_views_allowed, expiry_date) */}
                <table style={{ fontSize: 13, lineHeight: '2.4', width: '100%', maxWidth: 500 }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600, width: '60%', borderBottom: '1px solid #eee' }}>نمط انتهاء الصلاحية (Expiry Mode)</td>
                      {/* ✅ اسم الحقل الحقيقي: security.expiry_mode وليس drm.printingEnabled */}
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.expiry_mode ?? '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>نمط التحقق (Verify Mode)</td>
                      {/* ✅ اسم الحقل الحقيقي: security.verify_mode */}
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.verify_mode ?? '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, borderBottom: '1px solid #eee' }}>الحد الأقصى للمشاهدات (Max Views Allowed)</td>
                      {/* ✅ اسم الحقل الحقيقي: security.max_views_allowed */}
                      <td style={{ borderBottom: '1px solid #eee' }}>{document.security?.max_views_allowed ?? 'غير محدود'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>تاريخ انتهاء الحماية (Security Expiry Date)</td>
                      {/* ✅ اسم الحقل الحقيقي: security.expiry_date */}
                      <td>{document.security?.expiry_date ?? '—'}</td>
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

              {/* ✅ إحصائيات حقيقية من customers_count و publications_count */}
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.9, marginBottom: 20 }}>
                <p>عدد العملاء المصرح لهم: <strong>{document.customers_count ?? 0}</strong></p>
                <p>عدد المنشورات المرتبطة: <strong>{document.publications_count ?? 0}</strong></p>
              </div>

              <p style={{ fontSize: 13, color: '#555' }}>
                * ملاحظة: يتم هنا عرض قائمة بالعملاء الذين أُعطيوا حق الوصول المباشر لهذا المستند. (المكون الخاص بالجدول سيتم ربطه لاحقاً).
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
