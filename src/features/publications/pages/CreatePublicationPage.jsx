/**
 * ملف: CreatePublicationPage.jsx
 * الوظيفة: إضافة منشور جديد (Add Publication)
 * الوصف استناداً إلى دليل LockLizard V5:
 * - هذه الصفحة مسؤولة عن إنشاء وإضافة منشورات جديدة إلى النظام.
 * - واجهة المستخدم مبنية لتطابق تصميم V5 (نافذة منبثقة/بطاقة عرضية مركزية بتصميم كلاسيكي).
 * - تحتوي على الحقول الأساسية (الاسم، الوصف، خيار الالتزام بتاريخ بدء العميل).
 * - تمت إضافة تعليقات برمجية باللغة العربية فوق كل سطر لتوضيح آلية العمل.
 */

// استيراد خطاف (Hook) إدارة الحالة من مكتبة React
import { useState } from 'react'
// استيراد أداة التوجيه برمجياً بين صفحات التطبيق
import { useNavigate } from 'react-router-dom'
// استيراد الجيل الجديد من دوال API
import { useCreatePublication } from '../hooks/usePublications'
// استيراد أداة عرض الإشعارات للمستخدم
import toast from 'react-hot-toast'

// تعريف اللون الأساسي للهوية البصرية (Teal) المستخلص من LockLizard
const TEAL = '#009cad'

// المكون الرئيسي لصفحة قائمة إضافة المنشورات
const CreatePublicationPage = () => {
  // تفعيل أداة التوجيه البرمجي (Navigate)
  const navigate = useNavigate()
  // تفعيل خطاف الإضافة إلى الداتابيز
  const createMutation = useCreatePublication()

  // حالة (State) متغيرة لحفظ اسم المنشور
  const [name, setName] = useState('')
  // حالة (State) متغيرة لحفظ الوصف الخاص بالمنشور
  const [description, setDescription] = useState('')
  // حالة (State) متغيرة لحفظ قيمة صندوق الاختيار (مربع التحقق) الخاص بالالتزام بالتاريخ
  const [obeyStartDate, setObeyStartDate] = useState(false)

  // الدالة التي يتم استدعاؤها عند الضغط على زر "إضافة" (حفظ النموذج)
  const handleSubmit = (e) => {
    // منع السلوك الافتراضي للنموذج (تحديث الصفحة)
    e.preventDefault()
    
    // إيقاف العملية إذا كان الاسم فارغاً بعد إزالة الفراغات البيضاء
    if (!name.trim()) return

    // إرسال البيانات للباك إند عبر مسار React Query
    createMutation.mutate(
      { 
        name, 
        description, 
        obey: obeyStartDate 
      },
      {
        onSuccess: () => navigate('/publications'), // يتم التوجيه بعد نجاح الحفظ الفعلي
      }
    )
  }

  // === بداية رسم واجهة المستخدم (Render) ===
  return (
    // حاوية مرنة لتوسيط النموذج في منتصف الشاشة (كأنه نافذة منبثقة Modal)
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 40, minHeight: 'calc(100vh - 100px)' }}>
      
      {/* الغلاف الرئيسي لبطاقة إضافة المنشور، مع تحديد عرض ثابت ولمسة ظل خفيفة */}
      <div style={{ width: 650, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden', border: `1px solid ${TEAL}` }}>
        
        {/* === الترويسة الرئيسية الخاصة بـ LockLizard باللون الـ Teal === */}
        <div style={{
          background: TEAL, color: '#fff', padding: '12px 16px',
          fontWeight: 700, fontSize: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {/* عنوان النموذج باللغتين */}
          <span>إضافة منشور (Add Publication)</span>
          {/* زر الرجوع للخلف لإلغاء العملية والعودة للقائمة */}
          <button type="button" onClick={() => navigate('/publications')}
            style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
            &times;
          </button>
        </div>

        {/* نموذج إدخال البيانات (Form) المخصص للقراءة والاحتفاظ بالبيانات */}
        <form onSubmit={handleSubmit}>
          
          {/* === قسم معلومات المنشور (العنوان الرمادي الفاتح) === */}
          <div style={{ background: '#f5f5f5', padding: '8px 16px', fontWeight: 700, fontSize: 13, color: '#333', borderBottom: '1px solid #ddd' }}>
            تفاصيل المنشور (Publication Details)
          </div>

          {/* حاوية الحقول الداخلية للنموذج مع حواف (Padding) معتدلة */}
          <div style={{ padding: '24px 30px' }}>

            {/* صف إدخال "اسم المنشور" */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
              {/* التسمية التوضيحية (Label) في الجهة اليمنى */}
              <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>
                الاسم (Name)
              </label>
              <div style={{ flex: 1 }}>
                {/* حقل إدخال النص الخاص بالاسم، والحد الأقصى هو 64 حرفاً */}
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  maxLength={64} required
                  style={{ width: '100%', maxWidth: 350, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13 }} />
                {/* نص إرشادي لطول النص المدخل */}
                <small style={{ color: '#888', fontSize: 11, display: 'block', marginTop: 4 }}>
                  {name.length}/64 حرفاً (Characters)
                </small>
              </div>
            </div>

            {/* صف إدخال "وصف المنشور" */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}>
              {/* التسمية التوضيحية (Label) */}
              <label style={{ width: 140, fontWeight: 700, fontSize: 13, color: '#111', marginTop: 8 }}>
                الوصف (Description)
              </label>
              <div style={{ flex: 1 }}>
                {/* صندوق النص المتعدد الأسطر (Textarea) للحصول على الوصف الكامل */}
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={4} 
                  style={{ width: '100%', maxWidth: 450, border: '1px solid #ccc', borderRadius: 3, padding: '6px 10px', fontSize: 13, resize: 'vertical' }} />
              </div>
            </div>

            {/* صف خيار "الالتزام بتاريخ بدء العميل" (Checkbox) */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, paddingRight: 140 }}>
              {/* صندوق الاختيار */}
              <input type="checkbox" checked={obeyStartDate} onChange={e => setObeyStartDate(e.target.checked)}
                id="obeyStartDateCheck" style={{ marginLeft: 8 }} />
              {/* النص المرافق لصندوق الاختيار */}
              <label htmlFor="obeyStartDateCheck" style={{ fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#333' }}>
                الالتزام بتاريخ بدء العميل (Obey customer start date)
              </label>
            </div>

          </div>

          {/* الخط الفاصل السفلي الرمادي */}
          <div style={{ borderTop: '1px solid #ddd' }}></div>

          {/* حاوية الأزرار السفلية (الحفظ والإلغاء) */}
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#fafafa' }}>
            {/* زر الحفظ الأساسي بلون التيل */}
            <button type="submit" disabled={!name.trim() || createMutation.isPending}
              style={{
                background: TEAL, color: '#fff', border: 'none',
                borderRadius: 2, padding: '8px 24px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer',
                opacity: (!name.trim() || createMutation.isPending) ? 0.5 : 1
              }}>
              {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ (Save)'}
            </button>
            {/* زر الإلغاء والعودة للقائمة باللون الرمادي */}
            <button type="button" onClick={() => navigate('/publications')} disabled={createMutation.isPending}
              style={{
                background: '#e0e0e0', color: '#333', border: '1px solid #ccc',
                borderRadius: 2, padding: '8px 24px', fontSize: 13, cursor: 'pointer', fontWeight: 600
              }}>
              إلغاء (Cancel)
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default CreatePublicationPage
