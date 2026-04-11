// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد التنسيقات (CSS Modules) لصفحة إنشاء المستخدم
import styles from '../../pages/CreateUserPage.module.css';

// تعريف المكون الخاص بقسم "إدارة الوصول وتعيين الصلاحيات للمنشورات والمستندات"
// الخصائص (props) المستلمة:
// selectedPubs: قائمة المنشورات التي قام المختص بتحديدها حالياً لإعطائه الصلاحية لها
// selectedDocs: قائمة المستندات الفردية المحددة للوصول
// onOpenPubModal: الدالة التي تفتح نافذة المودال الخاص باختيار المنشورات
// onOpenDocModal: الدالة التي تفتح نافذة المودال لاختيار المستندات الفردية
export default function CreateUserManageAccess({ selectedPubs, selectedDocs, onOpenPubModal, onOpenDocModal }) {
  return (
    <>
      {/* ============================================================== */}
      {/* الترويسة الرمادية الفاصلة التي تحمل عنوان القطاع (إدارة الوصول) */}
      {/* ============================================================== */}
      <div className={styles.sectionHeaderStyle}>إدارة الوصول (Manage Access)</div>
      
      {/* الحاوية المخصصة للروابط مع هوامش داخلية مضبوطة */}
      <div className={styles.accessPadding}>
        
        {/* ========================================= */}
        {/* رابط 1: تعيين صلاحيات المنشورات */}
        {/* ========================================= */}
        <div className={styles.accessRow}>
          {/* رابط قابل للنقر يستدعي دالة فتح نافذة المنشورات (onOpenPubModal) ويمنع إعادة تحميل الصفحة */}
          <a href="#" onClick={(e) => { e.preventDefault(); onOpenPubModal(); }} className={styles.linkStyle}>
            {/* أيقونة كتاب/جريدة توضيحية */}
            <i className="bi bi-journal-text" style={{ marginInlineEnd: 6 }} /> تعيين الوصول للمنشورات (Set Publication Access)
          </a>
          
          {/* شرط عرض ذكي: إذا كانت هناك منشورات تم تحديدها سلفاً، اعرض "شارة" (Badge) توضح عددها */}
          {selectedPubs.length > 0 && <span className={styles.badgeStyle}>{selectedPubs.length} محدد</span>}
        </div>

        {/* ========================================= */}
        {/* رابط 2: تعيين الوصول للمستندات المباشرة */}
        {/* ========================================= */}
        <div className={styles.accessRowNoMargin}>
          {/* رابط أزرق لفتح نافذة اختيار المستندات (onOpenDocModal) وتخطي الحدث الافتراضي للرابط */}
          <a href="#" onClick={(e) => { e.preventDefault(); onOpenDocModal(); }} className={styles.linkStyle}>
            {/* أيقونة ورقة نصية للدلالة على المستند */}
            <i className="bi bi-file-earmark-text" style={{ marginInlineEnd: 6 }} /> تعيين الوصول للمستندات (Set Document Access)
          </a>
          
          {/* شرط العرض الذكي المرتبط بعدد المستندات: إذا تم تحديد وثائق سيعرض شارة توضح عدد الوثائق المحددة */}
          {selectedDocs.length > 0 && <span className={styles.badgeStyle}>{selectedDocs.length} محدد</span>}
        </div>
      </div>
    </>
  );
}
