// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد ملف التنسيقات المخصص لهذه الصفحة (CSS Module)
import styles from '../../pages/UserDetailPage.module.css';

// تعريف وتصدير المكون المسؤول عن قسم "معلومات التراخيص"
// يستقبل المكون الدوال والبيانات المطلوبة كخصائص (props):
// form: القيم الحالية للمدخلات
// handleChange: دالة تحديث القيم عند تغييرها
// handleDownloadLicense: دالة لطلب الترخيص من الخادم وتحميلهเป็นملف
// isDownloading: حالة توضح ما إذا كان التحميل جارياً لإظهار أيقونة الانتظار
// onOpenDeviceModal: دالة لفتح نافذة التحكم وتجميد الأجهزة المرتبطة بالترخيص
export default function CustomerLicensesInfo({ form, handleChange, handleDownloadLicense, isDownloading, onOpenDeviceModal }) {
  // إرجاع واجهة هذا القسم
  return (
    <>
      {/* الترويسة الرمادية التي تفصل هذا القسم عن غيره ويكون مكتوب فيها عنوان القسم */}
      <div className={styles.sectionHeaderStyle}>معلومات التراخيص (Licenses Information)</div>
      
      {/* الحاوية البيضاء التي تضم داخلها الأسطر والعناصر التابعة لقسم التراخيص */}
      <div className={styles.formWrapper}>
        
        {/* ========================================= */}
        {/* سطر بيانات: عدد التراخيص المسموحة للمستخدم */}
        {/* ========================================= */}
        <div className="form-row" className={styles.rowStyle}>
          {/* التسمية التوضيحية (Label) لكلمة التراخيص */}
          <div className="form-label-col" className={styles.labelColStyle}>التراخيص (Licenses)</div>
          <div className="form-input-col" className={styles.inputColStyle}>
            {/* حقل إدخال رقمي (number) لتحديد عدد التراخيص، مربوط بالقيمة form.licenses واقٌل قيمة مسموحة هي 1 */}
            <input type="number" name="licenses" value={form.licenses} onChange={handleChange} min={1} className={styles.inputStyle} style={{ width: 60 }} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر إجراءات الترخيص السريعة (تحميل، إرسال) */}
        {/* ========================================= */}
        <div className="form-row" className={styles.rowStyle}>
          {/* التسمية التوضيحية لعمود إجراءات الترخيص */}
          <div className="form-label-col" className={styles.labelColStyle}>الترخيص (License)</div>
          
          {/* حاوية فرعية لترتيب الروابط بشكل طولي (عمودي) وبمسافة بينها (gap: 6px) */}
          <div className={styles.inputColStyle} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            
            {/* رابط (أزرق) يمثل زر تحميل الترخيص كملف إلى جهاز المشغل */}
            {/* عند الضغط يتم تنفيذ دالة handleDownloadLicense */}
            {/* يتم تقليل شفافية الرابط وإلغاء استجابته مؤقتاً إذا كان جاري التحميل لتجنب تكرار الطلب */}
            <a href="#" onClick={handleDownloadLicense} className={styles.actionLinkStyle} style={{ opacity: isDownloading ? 0.5 : 1, pointerEvents: isDownloading ? 'none' : 'auto' }}>
              {/* أيقونة ديناميكية تتغير إلى ساعة رملية إذا بدأ التحميل للدلالة على الانتظار */}
              <i className={`bi ${isDownloading ? 'bi-hourglass-split' : 'bi-download'}`} style={{ marginLeft: 4 }} /> 
              {/* تغير النص أثناء عملية الانتظار والتحميل */}
              {isDownloading ? ' جاري التحميل...' : ' حفظ إلى ملف (Save to file)'}
            </a>
            
            {/* رابط إرسال الترخيص كرسالة بريد إلكتروني للعميل */}
            {/* تم إيقاف وظيفته الافتراضية لمنع إرجاع الصفحة لأعلى عند النقر (e.preventDefault) */}
            <a href="#" className={styles.actionLinkStyle} onClick={(e) => e.preventDefault()}>
              {/* أيقونة الظرف والمغلف بجانب النص */}
              <i className="bi bi-envelope" style={{ marginLeft: 4 }} /> إرسال إيميل (Send email)
            </a>
            
            {/* خيار توديع لرسالة الترخيص: تحديد ما إذا أردنا إعادة إرسال الترخيص لاحقاً */}
            <div className={styles.checkboxRow}>
              {/* مربع اختيار يحدد قيمة form.resendLicenseEmail */}
              <input type="checkbox" name="resendLicenseEmail" checked={form.resendLicenseEmail} onChange={handleChange} id="resendLic" />
              {/* نص التسمية لمربع الاختيار المرتبط بالـ id */}
              <label htmlFor="resendLic" className={styles.checkboxLabel}>إعادة إرسال الترخيص (Resend license email)</label>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر الإجراءات المتعلقة بجهاز الاتصال (Device) */}
        {/* ========================================= */}
        <div className="form-row" className={styles.rowStyle}>
          {/* التسمية التوضيحية لعمود الجهاز */}
          <div className="form-label-col" className={styles.labelColStyle}>الجهاز (Device)</div>
          
          <div className={styles.inputColStyle} style={{ display: 'flex', alignItems: 'center' }}>
            {/* رابط لفتح نافذة منبثقة للتحكم بالأجهزة المرتبطة بحساب هذا الشخص (حظر جهاز، تفعيل جهاز) */}
            {/* عند النقر، نمنع الحدث الافتراضي ثم نستدعي الدالة onOpenDeviceModal */}
            <a href="#" className={styles.actionLinkStyle} onClick={(e) => { e.preventDefault(); onOpenDeviceModal(); }}>
              {/* أيقونة الموبايل أو الهاتف الذكي */}
              <i className="bi bi-phone" style={{ marginLeft: 4 }} /> تعليق أو تفعيل (Suspend or Activate)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
