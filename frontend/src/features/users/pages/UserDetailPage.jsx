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

import CustomerAccountDetails from '../components/UserDetailSections/CustomerAccountDetails'
import CustomerLicensesInfo from '../components/UserDetailSections/CustomerLicensesInfo'
import CustomerWebViewer from '../components/UserDetailSections/CustomerWebViewer'
import CustomerManageAccess from '../components/UserDetailSections/CustomerManageAccess'
import CustomerHistoryLogs from '../components/UserDetailSections/CustomerHistoryLogs'

// استيراد تنسيقات CSS المخصصة لهذه الصفحة
import styles from './UserDetailPage.module.css'

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
      
      const custType = customerResponse?.data?.type || customerResponse?.type;
      // الحصول على اسم الملف المتوقع حسب نوع الترخيص من الباك إند أو الافتراضي
      const extension = custType === 'group' ? 'xlsx' : 'lzpk';
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
  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18 }}>جاري تحميل تفاصيل العميل...</div>
  if (isError) return <div style={{ padding: 40, textAlign: 'center', fontSize: 18, color: 'red' }}>حدث خطأ! لم يتم العثور على العميل.</div>

  // كائن العميل القادم من الباك إند، وقد تم فك تغليفه في الـ Interceptor (أو داخلياً)
  const cust = customerResponse?.data || customerResponse

  // دمج المكونات داخل هيكل الصفحة
  return (
    // مساحة سفلية فارغة للجمالية
    <div className={styles.pageContainer}>
      
      {/* حاوية رئيسية لتوسط التصميم وتحديد حجمه كصندوق ثابت مطابق للصورة */}
      <div className={styles.mainWrapper}>
        
        {/* الترويسة العلوية باللون الأزرق المائل للأخضر (Teal) وتحمل أيقونة المستخدم */}
        <div className={styles.topHeader}>
          {/* نص عنوان الترويسة المدمج عربي/إنجليزي */}
          <span>العميل (Customer): {form.name} ({form.email})</span>
          {/* أيقونة شخص (User Icon) بيضاء في الجهة المقابلة */}
          <i className="bi bi-person-fill" />
        </div>

        {/* المكونات المجزأة بدلاً من الكود المكدس القديم */}
        <CustomerAccountDetails 
          form={form} 
          cust={cust} 
          handleChange={handleChange}
          isToggling={bulkMutation.isPending}
          onStatusToggle={() => {
            const action = cust?.status === 'enabled' ? 'suspend' : 'activate';
            bulkMutation.mutate({ license_ids: [id], action }, {
              onSuccess: () => { toast.success(action === 'suspend' ? 'تم تجميد الحساب!' : 'تم تفعيل الحساب!'); window.location.reload(); },
              onError: () => toast.error('حدث خطأ!')
            });
          }}
        />

        <CustomerLicensesInfo 
          form={form} 
          handleChange={handleChange}
          handleDownloadLicense={handleDownloadLicense}
          isDownloading={downloadMutation.isPending}
          onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        />

        <CustomerWebViewer 
          form={form} 
        />

        <CustomerManageAccess 
          onOpenPubModal={() => setIsPubModalOpen(true)}
          onOpenDocModal={() => setIsDocModalOpen(true)}
        />

        <CustomerHistoryLogs 
          onOpenViewsModal={() => setIsViewsModalOpen(true)}
          onOpenPrintsModal={() => setIsPrintsModalOpen(true)}
          onOpenWebLoginModal={() => setIsWebLoginOpen(true)}
          onOpenEmailStatusModal={() => setIsEmailStatusOpen(true)}
        />

        {/* خط رمادي للفصل للتميز قبل الأزرار الرئيسية */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #ccc' }} />

        {/* الأزرار الختامية السفلية (Footer Action Buttons) */}
        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'center', gap: 10, backgroundColor: '#e6e6e6' }}>
          
          {/* زر حفظ التعديلات */}
          <button type="button" onClick={handleSave} disabled={updateMutation.isPending}
            style={{ backgroundColor: '#009cad', color: '#fff', border: 'none', padding: '6px 30px', fontSize: 13, cursor: updateMutation.isPending ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            {updateMutation.isPending ? 'جاري الحفظ...' : 'Save (حفظ)'}
          </button>

          {/* زر التراجع */}
          <button type="button" onClick={() => navigate('/users')} disabled={updateMutation.isPending}
            style={{ backgroundColor: '#888', color: '#fff', border: 'none', padding: '6px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold', opacity: updateMutation.isPending ? 0.7 : 1 }}>
            Cancel (إلغاء)
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* النوافذ المنبثقة (Modals) للعمليات الفرعية ستبقى كما هي */}
      {/* ============================================================== */}
      <SelectPublicationModal
        isOpen={isPubModalOpen}
        onClose={() => setIsPubModalOpen(false)}
        onSelect={(selectedData, action, fromDate, untilDate) => {
          setSelectedResource({ type: 'pub', data: selectedData });
          setAccessActionType(action);
          handlePublicationAccess(selectedData, action, fromDate, untilDate);
        }}
      />

      <SelectDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSelect={(selectedData, action, fromDate, untilDate) => {
          setSelectedResource({ type: 'doc', data: selectedData });
          setAccessActionType(action);
          handleDocumentAccess(selectedData, action, fromDate, untilDate);
        }}
      />

      <ConfirmAccessModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        items={selectedResource?.data || []}
        actionType={accessActionType}
        onConfirm={() => {
          if (selectedResource?.type === 'pub') {
            handlePublicationAccess(selectedResource.data, accessActionType);
          } else if (selectedResource?.type === 'doc') {
            handleDocumentAccess(selectedResource.data, accessActionType);
          }
        }}
      />

      <SuspendActivateDeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      <ChangeViewsModal
        isOpen={isViewsModalOpen}
        onClose={() => setIsViewsModalOpen(false)}
      />

      <ChangePrintsModal
        isOpen={isPrintsModalOpen}
        onClose={() => setIsPrintsModalOpen(false)}
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
