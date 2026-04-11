// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد التنسيقات (CSS Modules) الخاصة بصفحة الإنشاء
import styles from '../../pages/CreateUserPage.module.css';

// المكون المسؤول عن قسم "معلومات الترخيص" عند إضافة عميل جديد
// يستقبل المعامل (form) للحصول على قيمة حالة إرسال الإيميل
// ويستقبل (handleChange) لتحديث الحالة عند التبديل
export default function CreateUserLicenseInfo({ form, handleChange }) {
  return (
    <>
      {/* ============================================================== */}
      {/* الترويسة المحددة باللون الرمادي لعزل قسم وإبراز معلومات الترخيص */}
      {/* ============================================================== */}
      <div className={styles.sectionHeaderStyle}>معلومات الترخيص (License Information)</div>
      
      {/* الحاوية الداخلية للقسم مع إضافة المسافات المناسبة (Padding) */}
      <div className={styles.accessPadding}>
        
        {/* ========================================= */}
        {/* مربع التحديد (Checkbox) الخاص بإرسال الترخيص عبر البريد */}
        {/* ========================================= */}
        <div className={styles.checkboxContainer}>
          {/* عنصر الإدخال من نوع مربع تحديد.
              مربوط بالخاصية form.emailLicense لمعرفة التحديد (Checked)
              وعند التغيير يستدعي دالة handleChange */}
          <input type="checkbox" name="emailLicense" checked={form.emailLicense} onChange={handleChange} id="emailLic" />
          
          {/* التسمية التوضيحية للمربع التي تصف الإجراء للمستخدم. 
              عند الضغط على هذا النص سيتغير حالة المربع المرتبط بالـ id */}
          <label htmlFor="emailLic" className={styles.checkboxLabel}>إرسال الترخيص بالبريد (Email license)</label>
        </div>
      </div>
    </>
  );
}
