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
import { useCustomerDetails, useUpdateCustomer, useCustomerBulkAction, useDownloadLicense, useUpdatePublicationAccess, useUpdateDocumentAccess } from '../hooks/useUsers'
import SelectPublicationModal from '../components/SelectPublicationModal'
import SelectDocumentModal from '../components/SelectDocumentModal'
import ConfirmAccessModal from '../components/ConfirmAccessModal'
import SuspendActivateDeviceModal from '../components/SuspendActivateDeviceModal'
import ChangeViewsModal from '../components/ChangeViewsModal'
import ChangePrintsModal from '../components/ChangePrintsModal'
import WebViewerLoginHistoryModal from '../components/WebViewerLoginHistoryModal'
import EmailDeliveryStatusModal from '../components/EmailDeliveryStatusModal'

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

  // حالات النوافذ المنبثقة لإعطاء الصلاحيات (Manage Access)
  const [isPubModalOpen, setIsPubModalOpen] = useState(false)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
  const [isViewsModalOpen, setIsViewsModalOpen] = useState(false)
  const [isPrintsModalOpen, setIsPrintsModalOpen] = useState(false)
  const [isWebLoginOpen, setIsWebLoginOpen] = useState(false)
  const [isEmailStatusOpen, setIsEmailStatusOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [accessActionType, setAccessActionType] = useState('')

  const bulkMutation = useCustomerBulkAction()
  const downloadMutation = useDownloadLicense()
  const pubAccessMutation = useUpdatePublicationAccess()
  const docAccessMutation = useUpdateDocumentAccess()

  // عند تحميل بيانات العميل من الخادم بنجاح، نقوم بتعبئتها في النموذج (Form)
  useEffect(() => {
    // Laravel JsonResource يلف البيانات، والـ Axios interceptor يفك التغليف الأول
    // لذلك customerResponse قد يكون العنصر مباشرة أو بداخله data
    const cust = customerResponse?.data || customerResponse
    if (cust && cust.id) {
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
  }, [customerResponse])

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

  // دالة منح وصول المنشورات - تستخدم الـ endpoint الصحيح
  const handlePublicationAccess = (selectedPubs, action = 'unlimited', validFrom = '', validUntil = '') => {
    const pubIds = selectedPubs.map(p => p.id)
    if (!pubIds.length) return

    // تحويل action من المودال إلى ما يتوقعه الباك إند
    const apiAction = action === 'grant_unlimited' ? 'unlimited' 
                    : action === 'grant_limited' ? 'limited' 
                    : action === 'revoke' ? 'revoke' 
                    : action  // fallback

    const data = { action: apiAction, publication_ids: pubIds }
    if (apiAction === 'limited' && validFrom) data.valid_from = validFrom
    if (apiAction === 'limited' && validUntil) data.valid_until = validUntil

    pubAccessMutation.mutate({ customerId: id, data }, {
      onSuccess: () => {
        const msg = apiAction === 'revoke' 
          ? `تم سحب الوصول من ${pubIds.length} منشور بنجاح!`
          : `تم تحديث صلاحيات ${pubIds.length} منشور بنجاح!`
        toast.success(msg)
        setIsPubModalOpen(false)
      },
      onError: (err) => {
        toast.error('حدث خطأ أثناء تحديث صلاحيات المنشورات!')
        console.error(err)
      }
    })
  }

  // دالة منح وصول المستندات - تستخدم الـ endpoint الصحيح
  const handleDocumentAccess = (selectedDocs, action = 'unlimited', validFrom = '', validUntil = '') => {
    const docIds = selectedDocs.map(d => d.id)
    if (!docIds.length) return

    const apiAction = action === 'grant_unlimited' ? 'unlimited' 
                    : action === 'grant_limited' ? 'limited' 
                    : action === 'revoke' ? 'revoke' 
                    : action

    const data = { action: apiAction, document_ids: docIds }
    if (apiAction === 'limited' && validFrom) data.valid_from = validFrom
    if (apiAction === 'limited' && validUntil) data.valid_until = validUntil

    docAccessMutation.mutate({ customerId: id, data }, {
      onSuccess: () => {
        const msg = apiAction === 'revoke'
          ? `تم سحب الوصول من ${docIds.length} مستند بنجاح!`
          : `تم تحديث صلاحيات ${docIds.length} مستند بنجاح!`
        toast.success(msg)
        setIsDocModalOpen(false)
      },
      onError: (err) => {
        toast.error('حدث خطأ أثناء تحديث صلاحيات المستندات!')
        console.error(err)
      }
    })
  }

  // دالة تحميل ملف الترخيص
  const handleDownloadLicense = async (e) => {
    e.preventDefault();
    try {
      const blob = await downloadMutation.mutateAsync(id);
      
      // الحصول على اسم الملف المتوقع حسب نوع الترخيص من الباك إند أو الافتراضي
      const extension = cust?.type === 'group' ? 'xlsx' : 'lzpk';
      const fileName = `license_${id}.${extension}`;
      
      // إنشاء رابط مؤقت وتنزيل الملف
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // تنظيف الرابط
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل الترخيص بنجاح');
    } catch (error) {
      toast.error('فشل تحميل ملف الترخيص، قد يكون غير موجود');
      console.error(error);
    }
  }

  // في حالة التحميل أو وجود أخطاء، نعرض رسالة مناسبة قبل الواجهة
  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: TEAL }}>جاري تحميل تفاصيل العميل...</div>
  if (isError) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: 'red' }}>حدث خطأ! لم يتم العثور على العميل.</div>

  // كائن العميل القادم من الباك إند، وقد تم فك تغليفه في الـ Interceptor (أو داخلياً)
  const cust = customerResponse?.data || customerResponse

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
          <div className="form-row" style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div className="form-label-col" style={labelColStyle}>الاسم (Name)</div>
            {/* حقل الإدخال النصي */}
            <div className="form-input-col" style={inputColStyle}>
              <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الإيميل */}
          <div className="form-row" style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div className="form-label-col" style={labelColStyle}>البريد الإلكتروني (Email)</div>
            {/* حقل الإدخال للإيميل */}
            <div className="form-input-col" style={inputColStyle}>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الشركة */}
          <div className="form-row" style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div className="form-label-col" style={labelColStyle}>الشركة (Company)</div>
            {/* حقل الإدخال النصي للشركة */}
            <div className="form-input-col" style={inputColStyle}>
              <input type="text" name="company" value={form.company} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* سطر بيانات: الملاحظات */}
          <div className="form-row" style={rowStyle}>
            {/* التسمية التوضيحية (Label) */}
            <div className="form-label-col" style={labelColStyle}>ملاحظات (Notes)</div>
            {/* مربع نصي (Textarea) متعدد الأسطر للملاحظات */}
            <div className="form-input-col" style={inputColStyle}>
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
          <div className="form-row" style={rowInfoStyle}>
            <div className="form-label-col" style={labelInfoStyle}>المعرف (ID)</div>
            <div>{id || 1}</div>
          </div>
          
          {/* سطر عرض الحالة (Status) مع زر التجميد/التفعيل */}
          <div className="form-row" style={rowInfoStyle}>
            <div className="form-label-col" style={labelInfoStyle}>الحالة (Status)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: cust?.status === 'enabled' ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
                {cust?.status === 'enabled' ? 'مُفعل (enabled)' : 'مُجمد (suspended)'}
              </span>
              <button 
                onClick={() => {
                  const action = cust?.status === 'enabled' ? 'suspend' : 'activate';
                  bulkMutation.mutate({ license_ids: [id], action }, {
                    onSuccess: () => { toast.success(action === 'suspend' ? 'تم تجميد الحساب!' : 'تم تفعيل الحساب!'); window.location.reload(); },
                    onError: () => toast.error('حدث خطأ!')
                  });
                }}
                style={{ backgroundColor: cust?.status === 'enabled' ? '#ff9800' : '#4caf50', color: '#fff', border: 'none', padding: '3px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 'bold', borderRadius: 3 }}
              >
                {cust?.status === 'enabled' ? 'Suspend account' : 'Enable account'}
              </button>
            </div>
          </div>

          {/* سطر عرض تاريخ التسجيل (Registered) */}
          <div className="form-row" style={rowInfoStyle}>
            <div className="form-label-col" style={labelInfoStyle}>مُسجل في (Registered)</div>
            <div style={{ color: '#4caf50' }} dir="ltr">{cust?.registered || '-'}</div>
          </div>

          {/* سطر تاريخ البدء */}
          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>تاريخ البدء (Start Date)</div>
            <div className="form-input-col" style={inputColStyle}>
              <input type="text" disabled value={cust?.start_date ? cust.start_date.split(' ')[0] : '-'} style={{ ...inputStyle, width: 120, backgroundColor: '#f0f0f0' }} dir="ltr" />
            </div>
          </div>

          {/* سطر تاريخ الانتهاء */}
          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>صالح حتى (Valid until)</div>
            <div className="form-input-col" style={inputColStyle}>
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
          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>التراخيص (Licenses)</div>
            <div className="form-input-col" style={inputColStyle}>
              <input type="number" name="licenses" value={form.licenses} onChange={handleChange} min={1} style={{ ...inputStyle, width: 60 }} />
            </div>
          </div>

          {/* قسم عمليات الترخيص السريعة وحفظ الترخيص وإرساله */}
          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>الترخيص (License)</div>
            <div style={{ ...inputColStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* رابط أزرق لحفظ الترخيص إلى ملف محلي */}
              <a href="#" onClick={handleDownloadLicense} style={{...actionLinkStyle, opacity: downloadMutation.isPending ? 0.5 : 1, pointerEvents: downloadMutation.isPending ? 'none' : 'auto'}}>
                <i className={`bi ${downloadMutation.isPending ? 'bi-hourglass-split' : 'bi-download'}`} /> 
                {downloadMutation.isPending ? ' جاري التحميل...' : ' حفظ إلى ملف (Save to file)'}
              </a>
              {/* رابط أزرق لإرسال الترخيص عبر الإيميل للمستخدم */}
              <a href="#" style={actionLinkStyle}><i className="bi bi-envelope" /> إرسال إيميل (Send email)</a>
              
              {/* خيار لتأكيد إعادة إرسال إيميل الترخيص تلقائياً */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="resendLicenseEmail" checked={form.resendLicenseEmail} onChange={handleChange} id="resendLic" />
                <label htmlFor="resendLic" style={{ fontSize: 13, color: '#333' }}>إعادة إرسال الترخيص (Resend license email)</label>
              </div>
            </div>
          </div>

          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>الجهاز (Device)</div>
            <div style={{ ...inputColStyle, display: 'flex', alignItems: 'center' }}>
              <a href="#" style={actionLinkStyle} onClick={(e) => { e.preventDefault(); setIsDeviceModalOpen(true); }}>
                <i className="bi bi-phone" style={{ marginRight: 4 }} /> تعليق أو تفعيل (Suspend or Activate)
              </a>
            </div>
          </div>
        </div>

        {/* تم إزالة قسم تقييد الموقع (IP/Country) بطلب المستخدم */}

        {/* === قسم عارض الويب (Web Viewer) === */}
        <div style={sectionHeaderStyle}>عارض الويب (Web Viewer)</div>
        <div style={{ padding: '12px 15px' }}>
          
          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>مفعل (Enabled)</div>
            <div className="form-input-col" style={inputColStyle}>
              <i className="bi bi-check" style={{ color: TEAL, fontSize: 20 }} />
            </div>
          </div>

          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>اسم المستخدم (Username)</div>
            <div className="form-input-col" style={inputColStyle}>
              <input type="text" value={form.email} readOnly style={{ ...inputStyle, backgroundColor: '#f9f9f9', color: '#666' }} />
            </div>
          </div>

          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>كلمة المرور (Password)</div>
            <div className="form-input-col" style={inputColStyle}>
              <input type="text" value="********" readOnly style={{ ...inputStyle, backgroundColor: '#f9f9f9', color: '#666' }} />
            </div>
          </div>

          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>تسجيل الدخول (Logins)</div>
            <div className="form-input-col" style={inputColStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6 }}>
                <input type="checkbox" id="allowMultipleLogs" defaultChecked />
                <label htmlFor="allowMultipleLogs" style={{ fontSize: 13, color: '#333' }}>السماح بتسجيل دخول متزامن متعدد (allow multiple simultaneous logins)</label>
              </div>
            </div>
          </div>

          <div className="form-row" style={rowStyle}>
            <div className="form-label-col" style={labelColStyle}>إعادة إرسال (Resend)</div>
            <div className="form-input-col" style={inputColStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6 }}>
                <input type="checkbox" id="emailLoginInfo" />
                <label htmlFor="emailLoginInfo" style={{ fontSize: 13, color: '#333' }}>إرسال معلومات تسجيل الدخول (email login info)</label>
              </div>
            </div>
          </div>
          
        </div>

        {/* === قسم إدارة الوصول للصلاحيات (Manage Access) === */}
        <div style={sectionHeaderStyle}>إدارة الوصول (Manage Access)</div>
        <div style={{ padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          
          {/* رابط تعيين وصول المنشورات */}
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsPubModalOpen(true); }} style={{...actionLinkStyle, textDecoration: 'underline'}}>
              <i className="bi bi-journal-text" style={{ marginRight: 6 }} /> تعيين صلاحيات المنشورات (Set Publication Access)
            </a>
          </div>

          {/* رابط تعيين وصول المستندات */}
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsDocModalOpen(true); }} style={{...actionLinkStyle, textDecoration: 'underline'}}>
              <i className="bi bi-file-earmark-pdf" style={{ marginRight: 6 }} /> تعيين صلاحيات المستندات (Set Document Access)
            </a>
          </div>

          {/* رابط تغيير عدد المشاهدات */}
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsViewsModalOpen(true); }} style={{...actionLinkStyle, textDecoration: 'underline'}}>
              <i className="bi bi-eye" style={{ marginRight: 6 }} /> تغيير عدد المشاهدات (Change number of views)
            </a>
          </div>

          {/* رابط تغيير عدد الطباعات */}
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsPrintsModalOpen(true); }} style={{...actionLinkStyle, textDecoration: 'underline'}}>
              <i className="bi bi-printer" style={{ marginRight: 6 }} /> تغيير عدد الطباعات (Change number of prints)
            </a>
          </div>

        </div>

        {/* خط رمادي للفصل للتميز قبل الأزرار الرئيسية */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #ccc' }} />

        {/* الأزرار الختامية السفلية (Footer Action Buttons) */}
        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'center', gap: 10, backgroundColor: '#e6e6e6' }}>
          
          {/* زر حفظ التعديلات */}
          <button type="button" onClick={handleSave} disabled={updateMutation.isPending}
            style={{ backgroundColor: TEAL, color: '#fff', border: 'none', padding: '6px 30px', fontSize: 13, cursor: updateMutation.isPending ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            {updateMutation.isPending ? 'جاري الحفظ...' : 'Save (حفظ)'}
          </button>

          {/* زر التراجع */}
          <button type="button" onClick={() => navigate('/users')} disabled={updateMutation.isPending}
            style={{ backgroundColor: '#888', color: '#fff', border: 'none', padding: '6px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            Cancel (إلغاء)
          </button>
        </div>

        {/* === قسم سجل الأحداث السفلية (Event log) === */}
        <div style={{ ...sectionHeaderStyle, borderTop: '1px solid #ccc' }}>سجل الأحداث (Event log)</div>
        <div style={{ padding: '12px 15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 15 }}>
            <a href="#" style={actionLinkStyle} onClick={(e) => { e.preventDefault(); setIsWebLoginOpen(true); }}><i className="bi bi-window" style={{marginRight: 6}} /> Web Viewer Login History</a>
            <a href="#" style={actionLinkStyle} onClick={(e) => { e.preventDefault(); setIsEmailStatusOpen(true); }}><i className="bi bi-envelope-paper" style={{marginRight: 6}} /> Show status of last sent email</a>
          </div>

          <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5, padding: '8px', border: '1px solid #eee', backgroundColor: '#e9ecef' }} dir="ltr">
            11-01-2016 19:40:40 - Registration successful(license reuse). From:<br/>
            109.149.65.42 (BC-AE-C5-22-6B-22-285072491425) (Windows)<br/>
            10-20-2016 19:48:42 - Auto Restrict IP disabled<br/>
            10-20-2016 19:48:42 - Restrict IP removed.<br/>
            10-18-2016 14:13:57 - Auto Restrict IP 86.190.92.179<br/>
            10-18-2016 14:13:57 - Auto Restricted Country GB
          </div>

        </div>

      </div>

      {/* نوافذ تحديد الوصول المخفية افتراضياً */}
      <SelectPublicationModal 
        isOpen={isPubModalOpen} 
        onClose={() => setIsPubModalOpen(false)} 
        initialSelectedIds={cust?.publications?.map(p => p.id) || []}
        onSelect={handlePublicationAccess}
      />
      
      <SelectDocumentModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        initialSelectedIds={cust?.documents?.map(d => d.id) || []}
        onSelect={handleDocumentAccess}
      />

      <SuspendActivateDeviceModal 
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      <ChangeViewsModal 
        isOpen={isViewsModalOpen}
        onClose={() => setIsViewsModalOpen(false)}
        userName={form.name}
      />

      <ChangePrintsModal 
        isOpen={isPrintsModalOpen}
        onClose={() => setIsPrintsModalOpen(false)}
        userName={form.name}
      />

      <WebViewerLoginHistoryModal
        isOpen={isWebLoginOpen}
        onClose={() => setIsWebLoginOpen(false)}
      />

      <EmailDeliveryStatusModal
        isOpen={isEmailStatusOpen}
        onClose={() => setIsEmailStatusOpen(false)}
      />
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
