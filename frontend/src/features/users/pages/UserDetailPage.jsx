/**
 * ملف: UserDetailPage.jsx
 * الوظيفة: صفحة تفاصيل العميل (Customer Details Page)
 * الوصف:
 * - بناءً على الصورة المرجعية من دليل LockLizard.
 * - يتم عرض صفحة واحدة متكاملة تحتوي على (معلومات الحساب، التراخيص، تقييد الموقع، إدارة الوصول، وسجل الأحداث).
 * - تم استبعاد عارض الويب (Web Viewer) حسب طلب المستخدم.
 * - تمت إضافة تعليقات عربية مفصلة فوق كل سطر برمجي لشرح وظيفته.
 */

// استيراد مكتبة React و useState وإدارة التأثيرات
import React, { useState, useEffect } from 'react'
// استيراد أدوات التوجيه للتنقل بين الصفحات وجلب المعرف من الرابط
import { useNavigate, useParams } from 'react-router-dom'
// استيراد مكتبة التنبيهات لإظهار رسائل النجاح والخطأ
import toast from 'react-hot-toast'
// استيراد خطافات الواجهة الخلفية
import { useCustomerDetails, useUpdateCustomer } from '../hooks/useUsers'

// تعريف اللون الأساسي (Teal) المستخدم في تصميم LockLizard
const TEAL = '#009cad'
// تعريف اللون الرمادي لخلفية عناوين الأقسام
const GRAY_BG = '#e6e6e6'

export default function UserDetailPage() {
  // دالة تُستخدم للتنقل برمجياً بين صفحات التطبيق
  const navigate = useNavigate()
  // استخراج معرف العميل (id) من متغيرات مسار الرابط (URL params)
  const { id } = useParams()

  // جلب بيانات العميل الحالية من الباك إند
  const { data: customerResponse, isLoading, isError } = useCustomerDetails(id)
  const updateMutation = useUpdateCustomer()

  // حالة (State) لتخزين نموذج بيانات العميل
  const [form, setForm] = useState({
    name: '',                                         // اسم العميل
    email: '',                                        // بريد العميل
    company: '',                                      // شركة العميل
    notes: '',                                        // ملاحظات على العميل
    licenses: 1,                                      // عدد التراخيص المسموحة
    neverExpires: true,                               // هل التراخيص مشروطة بوقت
    validUntil: '',                                   // تاريخ الانتهاء (إذا وجد)
    resendLicenseEmail: false                         // إرسال بريد الترخيص مرة أخرى
  })

  // عند تحميل بيانات العميل من الخادم بنجاح، نقوم بتعبئتها في النموذج (Form)
  useEffect(() => {
    if (customerResponse?.data) {
      // Laravel JsonResource yلف البيانات داخل مفتاح "data" إضافي، فنتأكد من فكه هنا
      const cust = customerResponse.data.data ? customerResponse.data.data : customerResponse.data
      setForm({
        name: cust.name || '',
        email: cust.email || '',
        company: cust.company || '',
        notes: cust.note || '',
        licenses: cust.count_license || 1, // عدد الرخص يتم إرجاعه باسم count_license
        neverExpires: Boolean(cust.never_expires),
        validUntil: cust.valid_until ? cust.valid_until.split(' ')[0] : '',
        resendLicenseEmail: false
      })
    }
  }, [customerResponse?.data])

  // دالة لمعالجة التغييرات في حقول الإدخال بصورة ديناميكية
  const handleChange = (e) => {
    // استخراج الاسم والقيمة والنوع وحالة التحديد من العنصر الذي أطلق الحدث
    const { name, value, type, checked } = e.target
    // تحديث تفاصيل النموذج بناءً على الحقل الأخير المُعدل
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // دالة لحفظ البيانات عند النقر على الزر حفظ (Save)
  const handleSave = () => {
    updateMutation.mutate({
      id: id,
      data: {
        name: form.name,
        email: form.email,
        company: form.company,
        note: form.notes,
        never_expires: form.neverExpires,
        valid_until: form.neverExpires ? null : form.validUntil,
        // يمكننا إضافة إعادة إرسال الترخيص إذا أردنا: action: resend_license
      }
    }, {
      onSuccess: () => {
        toast.success('تم حفظ التعديلات بنجاح!')
        navigate('/users')
      },
      onError: (err) => {
        toast.error('حدث خطأ أثناء حفظ التعديلات!')
        console.error(err)
      }
    })
  }

  // في حالة التحميل أو وجود أخطاء، نعرض رسالة مناسبة قبل الواجهة
  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: TEAL }}>جاري تحميل تفاصيل العميل...</div>
  if (isError) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: 'red' }}>حدث خطأ! لم يتم العثور على العميل.</div>

  // كائن العميل القادم من الباك إند، مع فك التغليف المزدوج إذا وُجد
  const cust = customerResponse?.data?.data ? customerResponse.data.data : customerResponse?.data


  // دمج المكونات داخل هيكل الصفحة
  return (
    // مساحة سفلية فارغة للجمالية
    <div style={{ paddingBottom: 40 }}>
      
      {/* حاوية رئيسية لتوسط التصميم وتحديد حجمه كصندوق ثابت مطابق للصورة */}
      <div style={{ maxWidth: 650, margin: '20px auto', border: `1px solid ${TEAL}`, backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
        
        {/* الترويسة العلوية باللون الأزرق المائل للأخضر (Teal) وتحمل أيقونة المستخدم */}
        <div style={{ backgroundColor: TEAL, color: '#fff', padding: '6px 12px', fontWeight: 'bold', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* نص عنوان الترويسة المدمج عربي/إنجليزي */}
          <span>العميل (Customer): {form.name} ({form.email})</span>
          {/* أيقونة شخص (User Icon) بيضاء في الجهة المقابلة */}
          <i className="bi bi-person-fill" />
        </div>

        {/* الغلاف العام للنموذج (Form Wrapper) */}
        <div style={{ padding: '15px' }}>
          
          {/* سطر بيانات: الاسم */}
          <div style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div style={labelColStyle}>الاسم (Name)</div>
            {/* حقل الإدخال النصي */}
            <div style={inputColStyle}>
              <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الإيميل */}
          <div style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div style={labelColStyle}>البريد الإلكتروني (Email)</div>
            {/* حقل الإدخال للإيميل */}
            <div style={inputColStyle}>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الشركة */}
          <div style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div style={labelColStyle}>الشركة (Company)</div>
            {/* حقل الإدخال النصي للشركة */}
            <div style={inputColStyle}>
              <input type="text" name="company" value={form.company} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الملاحظات */}
          <div style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div style={labelColStyle}>ملاحظات (Notes)</div>
            {/* مربع نصي (Textarea) متعدد الأسطر للملاحظات */}
            <div style={inputColStyle}>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

        </div>

        {/* === قسم معلومات الحساب (Account Information) === */}
        {/* ترويسة رمادية للقسم */}
        <div style={sectionHeaderStyle}>معلومات الحساب (Account Information)</div>
        {/* محتوى القسم بمسافات وهوامش مطابقة */}
        <div style={{ padding: '12px 15px' }}>
          
          {/* سطر عرض المعرف (ID) */}
          <div style={rowInfoStyle}>
            <div style={labelInfoStyle}>المعرف (ID)</div>
            <div>{id || 1}</div>
          </div>
          
          {/* سطر عرض الحالة (Status) */}
          <div style={rowInfoStyle}>
            <div style={labelInfoStyle}>الحالة (Status)</div>
            <div style={{ color: cust?.status === 'enabled' ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
              {cust?.status === 'enabled' ? 'مُفعل (enabled)' : 'مُجمد (suspended)'}
            </div>
          </div>

          {/* سطر عرض تاريخ التسجيل (Registered) */}
          <div style={rowInfoStyle}>
            <div style={labelInfoStyle}>مُسجل في (Registered)</div>
            <div style={{ color: '#4caf50' }} dir="ltr">{cust?.registered || '-'}</div>
          </div>

          {/* سطر تاريخ البدء */}
          <div style={rowStyle}>
            <div style={labelColStyle}>تاريخ البدء (Start Date)</div>
            <div style={inputColStyle}>
              <input type="text" disabled value={cust?.start_date ? cust.start_date.split(' ')[0] : '-'} style={{ ...inputStyle, width: 120, backgroundColor: '#f0f0f0' }} dir="ltr" />
            </div>
          </div>

          {/* سطر تاريخ الانتهاء */}
          <div style={rowStyle}>
            <div style={labelColStyle}>صالح حتى (Valid until)</div>
            <div style={inputColStyle}>
              {form.neverExpires ? (
                <input type="text" disabled value="لا ينتهي" style={{ ...inputStyle, width: 140, backgroundColor: '#f0f0f0' }} dir="ltr" />
              ) : (
                <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} required style={{ ...inputStyle, width: 140 }} dir="ltr" />
              )}
              {/* مربع تحديد (Checkbox) الخاص بعدم الانتهاء أبداً */}
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="neverExpires" checked={form.neverExpires} onChange={handleChange} id="neverExp" />
                <label htmlFor="neverExp" style={{ fontSize: 13, color: '#333' }}>لا ينتهي أبداً (never expires)</label>
              </div>
            </div>
          </div>

        </div>

        {/* === قسم معلومات التراخيص (Licenses Information) === */}
        <div style={sectionHeaderStyle}>معلومات التراخيص (Licenses Information)</div>
        <div style={{ padding: '12px 15px' }}>
          
          {/* سطر عدد التراخيص */}
          <div style={rowStyle}>
            <div style={labelColStyle}>التراخيص (Licenses)</div>
            <div style={inputColStyle}>
              <input type="number" name="licenses" value={form.licenses} onChange={handleChange} min={1} style={{ ...inputStyle, width: 60 }} />
            </div>
          </div>

          {/* قسم عمليات الترخيص السريعة وحفظ الترخيص وإرساله */}
          <div style={rowStyle}>
            <div style={labelColStyle}>الترخيص (License)</div>
            <div style={{ ...inputColStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* رابط أزرق لحفظ الترخيص إلى ملف محلي */}
              <a href="#" style={actionLinkStyle}><i className="bi bi-download" /> حفظ إلى ملف (Save to file)</a>
              {/* رابط أزرق لإرسال الترخيص عبر الإيميل للمستخدم */}
              <a href="#" style={actionLinkStyle}><i className="bi bi-envelope" /> إرسال إيميل (Send email)</a>
              
              {/* خيار لتأكيد إعادة إرسال إيميل الترخيص تلقائياً */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="resendLicenseEmail" checked={form.resendLicenseEmail} onChange={handleChange} id="resendLic" />
                <label htmlFor="resendLic" style={{ fontSize: 13, color: '#333' }}>إعادة إرسال الترخيص (Resend license email)</label>
              </div>
            </div>
          </div>

          {/* قم بإضافة مزيد من المعلومات إذا احتاجها الباك إند هنا مستقبلاً */}

        </div>

        {/* تم استبعاد Web Viewer من النموذج كما طلب المستخدم سابقاً */}

        {/* === قسم إدارة الوصول للصلاحيات (Manage Access) === */}
        <div style={sectionHeaderStyle}>إدارة الوصول (Manage Access)</div>
        <div style={{ padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          
          {/* رابط أزرق لإعطاء حق الوصول للمنشورات */}
          <a href="#" style={actionLinkStyle}><i className="bi bi-journal-text" /> تعيين وصول المنشور (Set Publication Access)</a>
          {/* رابط أزرق لإعطاء حق الوصول للمستندات */}
          <a href="#" style={actionLinkStyle}><i className="bi bi-file-earmark-text" /> تعيين وصول المستند (Set Document Access)</a>
          {/* إزالة الروابط الزائدة بناءً على البنية التحتية للخادم */}

        </div>

        {/* خط رمادي للفصل للتميز قبل الأزرار الرئيسية */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #ccc' }} />

        {/* الأزرار الختامية السفلية (Footer Action Buttons) */}
        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'flex-start', gap: 10, backgroundColor: '#fff', flexDirection: 'row-reverse' }}>
          {/* زر إلغاء للعودة لصفحة اللستة للعملاء */}
          {/* زر التراجع */}
          <button type="button" onClick={() => navigate('/users')} disabled={updateMutation.isPending}
            style={{ backgroundColor: '#888', color: '#fff', border: 'none', padding: '6px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            إلغاء (Cancel)
          </button>
          
          {/* زر حفظ التعديلات */}
          <button type="button" onClick={handleSave} disabled={updateMutation.isPending}
            style={{ backgroundColor: TEAL, color: '#fff', border: 'none', padding: '6px 24px', fontSize: 13, cursor: updateMutation.isPending ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ (Save)'}
          </button>
        </div>

        {/* === قسم سجل الأحداث السفلية (Event log) === */}
        <div style={{ ...sectionHeaderStyle, borderTop: '1px solid #ccc' }}>سجل الأحداث (Event log)</div>
        <div style={{ padding: '12px 15px' }}>
          
          {/* قسم روابط سجل الأحداث (Web Viewer Login + Sent Email Status) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 15 }}>
            {/* رابط يعرض سجل تسجيل الدخول إذا وجد */}
            <a href="#" style={actionLinkStyle}><i className="bi bi-window" /> تاريخ دخول عارض الويب (Web Viewer Login history)</a>
            {/* رابط يعرض حالة آخر رسالة بريد أرسلت */}
            <a href="#" style={actionLinkStyle}><i className="bi bi-envelope-paper" /> إظهار حالة آخر إيميل (Show status of last sent email)</a>
          </div>

          {/* لوج نصي رمادي (Log Box) يعرض أحدث السجلات المسجلة على هذا المستخدم */}
          <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5, padding: '8px', border: '1px solid #eee', backgroundColor: '#fafafa' }} dir="ltr">
            11-01-2016 15:40:40 - Registration successful(license issue). From:<br/>
            105.145.65.42 (B2-AE-E6-22-08-32 : UUID ) (Windows)
          </div>

        </div>

      </div>
    </div>
  )
}

// === تعريف الأنماط والثوابت (CSS Styles) المخصصة للتصميم الدقيق ===

// نمط حاوية السطر في الشاشة (Row Wrapper)
const rowStyle = { 
  display: 'flex', 
  marginBottom: 10 
}
// نمط التسمية التوضيحية لسطر النموذج (Label Column)
const labelColStyle = { 
  width: 130, 
  fontWeight: 'bold', 
  fontSize: 12, 
  color: '#333',
  paddingTop: 6
}
// نمط عمود الإدخال (Input Column)
const inputColStyle = { 
  flex: 1 
}

// نمط حاوية السطور في قسم المعلومات (Account Info Row)
const rowInfoStyle = {
  display: 'flex',
  marginBottom: 4,
  fontSize: 12
}
// نمط التسمية التوضيحية داخل قسم المعلومات
const labelInfoStyle = {
  width: 130,
  fontWeight: 'bold',
  color: '#333'
}

// النمط الأساسي للحقول النصية ومحتويات الإدخال
const inputStyle = { 
  width: '100%', 
  maxWidth: 350,
  border: '1px solid #ccc', 
  padding: '6px 8px', 
  fontSize: 13,
  outline: 'none',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
  fontFamily: 'inherit'
}

// نمط الترويسات الرمادية للأقسام (Gray Headers)
const sectionHeaderStyle = {
  backgroundColor: GRAY_BG,
  color: '#555',
  fontWeight: 'bold',
  fontSize: 12,
  padding: '6px 20px',
  borderTop: '1px solid #ccc',
  borderBottom: '1px solid #ccc'
}

// نمط الروابط الزرقاء للإجراءات السريعة والمختصرات
const actionLinkStyle = {
  color: TEAL,
  textDecoration: 'none',
  fontSize: 13,
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'underline'
}
