// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد ملف التنسيقات (CSS Module) الموحد لهذه الصفحة
import styles from '../../pages/UserDetailPage.module.css';

// تعريف وتصدير مكون "عارض الويب" (Web Viewer) المعني بتفاصيل دخول العميل عبر المتصفح
// يستقبل المكون خاصية form لقراءة إيميل العميل (كمعرف واسم مستخدم)
export default function CustomerWebViewer({ form }) {
  // إرجاع واجهة هذا القسم
  return (
    <>
      {/* الترويسة الرمادية الفاصلة التي تحمل عنوان "عارض الويب" */}
      <div className={styles.sectionHeaderStyle}>عارض الويب (Web Viewer)</div>
      
      {/* الغلاف العام لاحتواء العناصر المندرجة تحت قسم عارض الويب */}
      <div className={styles.formWrapper}>
        
        {/* ========================================= */}
        {/* سطر بيانات: توضيح ما إذا كانت الخاصية مفعلة */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          {/* التسمية التوضيحية (مفعل Enabled) */}
          <div className={"form-label-col " + styles.labelColStyle}>مفعل (Enabled)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* أيقونة علامة صح (Check) باللون الأزرق المائل للأخضر للدلالة على التفعيل، حجم الخط 20 */}
            <i className="bi bi-check" style={{ color: '#009cad', fontSize: 20 }} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر بيانات: اسم المستخدم لعارض الويب */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>اسم المستخدم (Username)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل إدخال يعرض إيميل العميل كاسم مستخدم، تمت إضافة خاصية readOnly لأن هذا الحقل للعرض فقط ولا يمكن تعديله، وتم تغيير لون خلفيته ليكون رمادي */}
            <input type="text" value={form.email} readOnly className={`${styles.inputStyle} ${styles.inputStyleReadOnly}`} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر بيانات: كلمة المرور لعارض الويب */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>كلمة المرور (Password)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل إدخال يعرض كلمة سر مخفية كنقاط (********) ومقفل للتعديل أيضاً */}
            <input type="text" value="********" readOnly className={`${styles.inputStyle} ${styles.inputStyleReadOnly}`} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر بيانات: إعدادات جلسات تسجيل الدخول */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>تسجيل الدخول (Logins)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* تصميم الحاوية بشكل يعطي مساحة في الأعلى وترتيب أفقي لمربع التحديد ونص التوضيح */}
            <div className={styles.checkboxRow} style={{ paddingTop: 6 }}>
              {/* مربع تحديد ليأذن للمستخدم بالدخول من أجهزة متعددة في نفس الوقت، ومحدد تلقائياً (defaultChecked) */}
              <input type="checkbox" id="allowMultipleLogs" defaultChecked />
              {/* التسمية التوضيحية المرتبطة بمربع التحديد */}
              <label htmlFor="allowMultipleLogs" className={styles.checkboxLabel}>السماح بتسجيل دخول متزامن متعدد (allow multiple simultaneous logins)</label>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر بيانات: طلب إرسال أوامر الدخول مرة أخرى */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>إعادة إرسال (Resend)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* تصميم الحاوية بنفس الطريقة الأفقية السابقة الخاصة بمربعات التحديد */}
            <div className={styles.checkboxRow} style={{ paddingTop: 6 }}>
              {/* مربع تحديد يأمر النظام بإرسال إيميل يحتوي على الرابط والاسم وكلمة المرور مجدداً */}
              <input type="checkbox" id="emailLoginInfo" />
              {/* التسمية التوضيحية لزر الإرسال الخاص بمعلومات الدخول للويب */}
              <label htmlFor="emailLoginInfo" className={styles.checkboxLabel}>إرسال معلومات تسجيل الدخول (email login info)</label>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
