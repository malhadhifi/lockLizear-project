// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد ملف التنسيقات (CSS Module) الموحد لهذه الصفحة لضمان نفس التصميم
import styles from '../../pages/UserDetailPage.module.css';

// تعريف وتصدير المكون المنوط به قسم "تاريخ الأحداث" (History Logs)
// يستقبل 4 دوال من الصفحة الرئيسية كخصائص (props) لفتح النوافذ المنبثقة:
// 1. onOpenViewsModal: دالة لفتح سجلات مشاهدات المستندات
// 2. onOpenPrintsModal: دالة لفتح سجلات أوامر الطباعة لهذا العميل
// 3. onOpenWebLoginModal: دالة لفتح سجل دخول العميل للويب 
// 4. onOpenEmailStatusModal: دالة لعرض سجلات وصول رسائل البريد الإلكتروني (الإيميلات)
export default function CustomerHistoryLogs({ onOpenViewsModal, onOpenPrintsModal, onOpenWebLoginModal, onOpenEmailStatusModal }) {
  return (
    <>
      {/* ============================================================== */}
      {/* الترويسة الرمادية الفاصلة التي تحمل عنوان القطاع (تاريخ الأحداث) */}
      {/* ============================================================== */}
      <div className={styles.sectionHeaderStyle}>تاريخ الأحداث (History)</div>
      
      {/* حاوية القسم: تم تعديل خلفيتها بلون رمادي خفيف جداً (#fdfdfd) للتميز عن باقي الصناديق */}
      <div className={styles.formWrapper} style={{ backgroundColor: '#fdfdfd' }}>
        
        {/* ========================================= */}
        {/* زر 1: مشاهدة سجلات فتح المستندات (View Logs) */}
        {/* ========================================= */}
        <button 
          onClick={onOpenViewsModal} // استدعاء الدالة لفتح مودال المشاهدات
          // دمج كلاسات مكتبة البوتستراب (btn btn-link) مع كلاساتنا المعزولة لكي يبدو الزر كأنه مجرد نص برابط أزرق
          className={`btn btn-link ${styles.historyButton} ${styles.actionLinkStyle}`} 
          style={{ padding: 0 }} // تصفير الحواف (padding) ليتساوى مع حجم النص الفعلي
        >
          {/* أيقونة العين للدلالة على المشاهدة والإبصار */}
          <i className="bi bi-eye" /> مشاهدة سجلات الفتح (View open history)
        </button>
        
        {/* ========================================= */}
        {/* زر 2: مشاهدة سجلات طباعة المستندات (Print Logs) */}
        {/* ========================================= */}
        <button 
          onClick={onOpenPrintsModal} // استدعاء دالة فتح مودال سجلات الطباعة
          className={`btn btn-link ${styles.historyButton} ${styles.actionLinkStyle}`} 
          style={{ padding: 0 }}
        >
          {/* أيقونة الطابعة */}
          <i className="bi bi-printer" /> عرض سجلات الطباعة (View print history)
        </button>

        {/* ========================================= */}
        {/* زر 3: مشاهدة سجلات الدخول لعارض الويب (Web Viewer Logins) */}
        {/* ========================================= */}
        <button 
          onClick={onOpenWebLoginModal} // استدعاء دالة فتح مودال سجلات الويب (للأجهزة ونوع المتصفح)
          className={`btn btn-link ${styles.historyButton} ${styles.actionLinkStyle}`} 
          style={{ padding: 0 }}
        >
          {/* أيقونة اللابتوب أو الشاشة للدلالة على المتصفح */}
          <i className="bi bi-laptop" /> مشاهدة سجلات الدخول للويب (View Web Viewer logins)
        </button>

        {/* ========================================= */}
        {/* زر 4: سجلات توصيل ونقل أيميلات النظام للمستخدم */}
        {/* ========================================= */}
        <button 
          onClick={onOpenEmailStatusModal} // استدعاء الدالة المخصصة لسجلات البريد
          className={`btn btn-link ${styles.historyButton} ${styles.actionLinkStyle}`} 
          style={{ padding: 0 }}
        >
          {/* أيقونة مغلف رسائل مفتوح */}
          <i className="bi bi-envelope-open" /> سجلات توصيل الإيميل (Email delivery status)
        </button>
        
      </div>
    </>
  );
}
