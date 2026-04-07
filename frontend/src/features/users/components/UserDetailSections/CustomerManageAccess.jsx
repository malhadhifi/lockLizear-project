// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد ملف التنسيقات (CSS Module) الموحد لهذه الصفحة لضمان نفس التصميم الأساسي
import styles from '../../pages/UserDetailPage.module.css';

// تعريف المكون الخاص بقسم "إدارة الوصول" والصلاحيات للعميل
// يأخذ دالتين كخصائص (props):
// 1. onOpenPubModal: دالة مسؤولة عن إظهار وتفعيل النافذة الخاصة بمنح أو سحب صلاحيات المنشورات للعميل
// 2. onOpenDocModal: دالة مسؤولة عن إظهار وتفعيل النافذة الخاصة بمنح أو سحب صلاحيات المستندات الفردية للعميل
export default function CustomerManageAccess({ onOpenPubModal, onOpenDocModal }) {
  // إرجاع واجهة القسم
  return (
    <>
      {/* الترويسة الرمادية الفاصلة التي تحمل عنوان (إدارة الوصول) لتوضيح القطاع */}
      <div className={styles.sectionHeaderStyle}>إدارة الوصول (Manage Access)</div>
      
      {/* الغلاف العام: تم ترتيب العناصر داخله بشكل عمودي (column) مع ترك فجوة (gap) بمقدار 10 بين الروابط */}
      <div className={styles.formWrapper} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        
        {/* ========================================= */}
        {/* 1. رابط خاص بتعيين تفويضات المنشورات */}
        {/* ========================================= */}
        <div>
          {/* رابط أزرق يفتح نافذة إدارة المنشورات. تم تجاوز السلوك الافتراضي (e.preventDefault) لكي لا يقفز المتصفح لمكان آخر */}
          <a href="#" onClick={(e) => { e.preventDefault(); onOpenPubModal(); }} className={styles.actionLinkStyle}>
            {/* أيقونة كتاب/مجلة (journal) بجانب الزر */}
            <i className="bi bi-journal-text" style={{ marginLeft: 6 }} /> 
            {/* النص الظاهر للمستخدم */}
            تعيين صلاحيات المنشورات (Set Publication Access)
          </a>
        </div>

        {/* ========================================= */}
        {/* 2. رابط خاص بتعيين تفويضات المستندات المباشرة */}
        {/* ========================================= */}
        <div>
          {/* رابط أزرق يفتح نافذة إدارة وصول المستندات مباشرة بعيداً عن المنشورات الكاملة */}
          <a href="#" onClick={(e) => { e.preventDefault(); onOpenDocModal(); }} className={styles.actionLinkStyle}>
            {/* أيقونة ملف عليه علامة قفل للدلالة على الأمان والحماية */}
            <i className="bi bi-file-earmark-lock" style={{ marginLeft: 6 }} /> 
            {/* النص الظاهر للمستخدم */}
            تعيين صلاحيات المستندات (Set Document Access)
          </a>
        </div>
        
      </div>
    </>
  );
}
