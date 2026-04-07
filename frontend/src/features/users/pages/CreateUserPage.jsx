/**
 * ملف: CreateUserPage.jsx
 * الوظيفة: إضافة عميل جديد (Add New Customer)
 * الوصف استناداً إلى دليل LockLizard: 
 * - هذه الصفحة مسؤولة عن عرض نموذج الإضافة الخاص بالعملاء الجدد.
 * - واجهة المستخدم مطابقة بالكامل للتصميم الأصلي (إصدار V5) بنمط الصناديق (Boxes).
 * - تتضمن الحقول الأساسية: الاسم، الشركة، البريد الإلكتروني، التراخيص، تواريخ الصلاحية.
 * - تتضمن قسماً لـ "إدارة الوصول" (Manage Access) مع روابط وهمية للإشارة لضرورة حفظ العميل أولاً.
 * - تتضمن معلومات الترخيص (License Information).
 * - تم استبعاد عارض الويب بناءً على الطلب الأخير.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/userApi'
import SelectPublicationModal from '../components/SelectPublicationModal'
import SelectDocumentModal from '../components/SelectDocumentModal'

import CreateUserMainInfo from '../components/CreateUserSections/CreateUserMainInfo'
import CreateUserManageAccess from '../components/CreateUserSections/CreateUserManageAccess'
import CreateUserLicenseInfo from '../components/CreateUserSections/CreateUserLicenseInfo'

import styles from './CreateUserPage.module.css'

const CreateUserPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // حالة (State) لتهيئة وتخزين مدخلات نموذج إضافة العميل الجديد
  const [form, setForm] = useState({
    name: '', company: '', email: '', 
    type: 'individual', count_license: 1,
    startDate: new Date().toISOString().split('T')[0], // افتراضياً تاريخ اليوم
    validUntil: '', neverExpires: true,
    notes: '',
    emailLicense: true
  })

  // حالات النوافذ المنبثقة للاختيار
  const [isPubModalOpen, setIsPubModalOpen] = useState(false)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [selectedPubs, setSelectedPubs] = useState([])
  const [selectedDocs, setSelectedDocs] = useState([])

  // خطاف (Hook) للاتصال بالخادم وإرسال طلب الإضافة
  const mutation = useMutation({
    mutationFn: userApi.createCustomer,
    onSuccess: () => {
      toast.success('تمت إضافة العميل بنجاح!')
      queryClient.invalidateQueries({ queryKey: ['customers'] }) // تحديث قائمة العملاء فوراً
      navigate('/users') // توجيه المستخدم لصفحة قائمة العملاء
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء إضافة العميل، يرجى المحاولة مرة أخرى.')
      console.error(error)
    }
  })

  const submit = (e) => {
    e.preventDefault()
    // جلب بيانات الحساب الحالي من الجلسة
    const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
    const publisherId = adminUser.id || 1; // 1 كاحتياط في حال لم يتم تسجيل الدخول بعد

    // ربط البيانات كما يتوقعها الباك إند (Laravel Payload)
    const dataToSend = {
      publisher_id: publisherId, 
      name: form.name,
      email: form.email,
      company: form.company,
      note: form.notes,
      type: form.type,
      valid_from: form.startDate,
      never_expires: form.neverExpires,
      valid_until: form.neverExpires ? null : form.validUntil, // إرسال null إذا كانت لا تنتهي
      send_via_email: form.emailLicense,
      publications: selectedPubs.map(p => p.id),
      documents: selectedDocs.map(d => d.id)
    }

    if (form.type === 'group') {
      dataToSend.count_license = parseInt(form.count_license, 10) || 1
    }

    mutation.mutate(dataToSend)
  }

  // معالجة تغييرات نصوص صناديق الإدخال وتحديث الحالة
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className={styles.pageContainer}>
      {/* === مساحة علوية فارغة للأبعاد الجمالية === */}
      <div className={styles.spacer} />

      {/* === الحاوية الرئيسية للنموذج (Main Container) === */}
      <div className={styles.mainWrapper}>
        
        {/* شريط العنوان العلوي (Header) */}
        <div className={styles.topHeader}>
          <div className={styles.headerTitle}>
            <span>إضافة عميل جديد (New customer)</span>
          </div>
          <i className="bi bi-person-plus-fill" />
        </div>

        {/* بداية النموذج الذي يتصل بدالة الحفظ عند الإرسال */}
        <form onSubmit={submit}>
          
          <CreateUserMainInfo 
            form={form} 
            handleChange={handleChange} 
          />

          <CreateUserManageAccess 
            selectedPubs={selectedPubs} 
            selectedDocs={selectedDocs} 
            onOpenPubModal={() => setIsPubModalOpen(true)}
            onOpenDocModal={() => setIsDocModalOpen(true)}
          />

          <CreateUserLicenseInfo 
            form={form}
            handleChange={handleChange}
          />

          <hr className={styles.divider} />

          {/* شريط الإجراءات السفلي وأزرار الإرسال (Footer Actions) */}
          <div className={styles.footerActions}>
             <button type="submit" disabled={mutation.isPending}
              className={styles.submitButton}
              style={{
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                opacity: mutation.isPending ? 0.7 : 1
              }}>
              {mutation.isPending ? 'جاري الإضافة...' : 'إضافة (Add)'}
            </button>
          </div>

        </form>
      </div>

      <SelectPublicationModal 
        isOpen={isPubModalOpen} 
        onClose={() => setIsPubModalOpen(false)} 
        onSelect={(pubs) => { setSelectedPubs(pubs); setIsPubModalOpen(false) }} 
      />
      
      <SelectDocumentModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        onSelect={(docs) => { setSelectedDocs(docs); setIsDocModalOpen(false) }} 
      />
    </div>
  )
}

export default CreateUserPage
