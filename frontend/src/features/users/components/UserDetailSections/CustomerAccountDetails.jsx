// استيراد مكتبة React الأساسية لبناء المكون
import React from 'react';
// استيراد التنسيقات (CSS) الخاصة بالصفحة لضمان شكل التصميم
import styles from '../../pages/UserDetailPage.module.css';

// تعريف وتصدير المكون الوظيفي (CustomerAccountDetails) الذي يستقبل الخصائص (props) التالية:
// form: القيم الحالية للحقول (اسم، إيميل، الخ)
// cust: بيانات العميل الأصلية القادمة من الباك إند
// handleChange: دالة لتحديث أي تغيير يكتبه المستخدم في الحقول
// onStatusToggle: دالة يتم استدعاؤها عند النقر على زر "تجميد/تفعيل الحساب"
// isToggling: حالة منطقية (true/false) لمعرفة ما إذا كان طلب التجميد قيد الانتظار لمعطلة الزر
export default function CustomerAccountDetails({ form, cust, handleChange, onStatusToggle, isToggling }) {
  // إرجاع واجهة المستخدم (الـ JSX) المكونة من قسمين رئيسيين مجتمعين داخل Fragment (<>)
  return (
    <>
      {/* الغلاف العام لاحتواء حقول الإدخال الأساسية */}
      <div className={styles.formWrapper}>
        
        {/* ========================================= */}
        {/* سطر إدخال بيانات: الاسم (Name) */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          {/* التسمية التوضيحية (Label) لخانة الاسم */}
          <div className={"form-label-col " + styles.labelColStyle}>الاسم (Name)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل إدخال نصي للاسم، مربوطة بقيمة form.name الدالة handleChange */}
            <input type="text" name="name" value={form.name} onChange={handleChange} required className={styles.inputStyle} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر إدخال بيانات: البريد الإلكتروني (Email) */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          {/* التسمية التوضيحية لخانة الإيميل */}
          <div className={"form-label-col " + styles.labelColStyle}>البريد الإلكتروني (Email)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل إدخال مخصص للإيميل، مربوط بقيمة form.email */}
            <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.inputStyle} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر إدخال بيانات: الشركة (Company) */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          {/* التسمية التوضيحية لخانة اسم الشركة */}
          <div className={"form-label-col " + styles.labelColStyle}>الشركة (Company)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل نصي لإدخال اسم الشركة، مربوط بقيمة form.company */}
            <input type="text" name="company" value={form.company} onChange={handleChange} className={styles.inputStyle} />
          </div>
        </div>

        {/* ========================================= */}
        {/* سطر إدخال بيانات: الملاحظات (Notes) */}
        {/* ========================================= */}
        <div className={"form-row " + styles.rowStyle}>
          {/* التسمية التوضيحية لخانة الملاحظات */}
          <div className={"form-label-col " + styles.labelColStyle}>ملاحظات (Notes)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* مربع نصي (Textarea) لكتابة ملاحظات طويلة، يمكن تغيير ارتفاعه عمودياً */}
            <textarea name="notes" value={form.notes} onChange={handleChange} className={styles.inputStyle} style={{ resize: 'vertical', minHeight: 60 }} />
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* الترويسة الرمادية الفاصلة لقسم (معلومات الحساب الإضافية) */}
      {/* ======================================================= */}
      <div className={styles.sectionHeaderStyle}>معلومات الحساب (Account Details)</div>
      
      {/* حاوية جديدة لعرض معلومات الحساب الثابتة كالمعرف والتواريخ */}
      <div className={styles.formWrapper}>
        
        {/* سطر عرض المعرف الخاص بالعميل (ID) في قاعدة البيانات */}
        <div className={"form-row " + styles.rowInfoStyle}>
          <div className={"form-label-col " + styles.labelInfoStyle}>رقم الحساب (ID)</div>
          {/* طباعة المعرف أو أداة (-) إذا لم يكن موجوداً */}
          <div>{cust?.id || '-'}</div>
        </div>

        {/* سطر يوضح حالة الحساب الحالية: هل هو مفعل أم معلق؟ */}
        <div className={"form-row " + styles.rowInfoStyle}>
          {/* تسمية توضح هل الحساب مجمد أم لا */}
          <div className={"form-label-col " + styles.labelInfoStyle}>تجميد الحساب (Suspended)</div>
          {/* ترتيب العناصر بشكل أفقي مع وجود فجوة (gap) بينها */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            
            {/* عرض كلمة (No) بالأخضر إذا كان مفعل، و (Yes) بالأحمر إذا كان مجمد */}
            <span style={{ color: cust?.status === 'enabled' ? '#4caf50' : '#f44336' }}>
              {cust?.status === 'enabled' ? 'No' : 'Yes'}
            </span>
            
            {/* زر اتخاذ إجراء التفعيل/التجميد */}
            <button 
              onClick={onStatusToggle} // استدعاء الدالة الممررة عند الضغط
              disabled={isToggling} // تعطيل الزر أثناء إرسال الطلب (لمنع النقر المتكرر)
              // تلوين الزر بناءً على الحالة: برتقالي للتجميد، أخضر للتفعيل
              style={{ backgroundColor: cust?.status === 'enabled' ? '#ff9800' : '#4caf50', color: '#fff', border: 'none', padding: '3px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 'bold', borderRadius: 3 }}
            >
              {/* النص المكتوب داخل الزر يتغير حسب حالة العميل الحالية */}
              {cust?.status === 'enabled' ? 'Suspend account' : 'Enable account'}
            </button>
          </div>
        </div>

        {/* سطر يوضح التاريخ والوقت الذي تم فيه إنشاء أو تسجيل هذا العميل */}
        <div className={"form-row " + styles.rowInfoStyle}>
          <div className={"form-label-col " + styles.labelInfoStyle}>مُسجل في (Registered)</div>
          {/* عرض تاريخ التسجيل باللون الأخضر وباتجاه من اليسار لليمين ليظهر النص الإنجليزي بشكل صحيح */}
          <div style={{ color: '#4caf50' }} dir="ltr">{cust?.registered || '-'}</div>
        </div>

        {/* سطر يوضح تاريخ بداية تفعيل التراخيص لهذا العميل */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>تاريخ البدء (Start Date)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            {/* حقل يعرض التاريخ وهو معطل (disabled) لأن النظام هو الذي يحدده أو يتطلب تغييره بطريقة مختلفة */}
            <input type="text" disabled value={cust?.start_date ? cust.start_date.split(' ')[0] : '-'} className={`${styles.inputStyle} ${styles.inputStyleDisabled}`} style={{ width: 120 }} dir="ltr" />
          </div>
        </div>

        {/* سطر تحديد أو إظهار متى ينتهي اشتراك العميل (تاريخ الانتهاء) */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>صالح حتى (Valid until)</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            
            {/* شرط: إذا كان خيار لا ينتهي (neverExpires) مفعلاً، نعرض حقل معطل مكتوب فيه "لا ينتهي" */}
            {form.neverExpires ? (
              <input type="text" disabled value="لا ينتهي" className={`${styles.inputStyle} ${styles.inputStyleDisabled}`} style={{ width: 140 }} dir="ltr" />
            ) : (
              // أما إذا لم يكن الخيار مفعلاً، نعرض حقل تحديد نوعه (date) لاختيار تاريخ الانتهاء يدوياً
              <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} required className={styles.inputStyle} style={{ width: 140 }} dir="ltr" />
            )}
            
            {/* إضافة خيار مربع التحديد (Checkbox) للمستخدم ليقرر ما إذا كان الحساب غير منتهي الصلاحية */}
            <div className={styles.checkboxRow}>
              {/* مربع التحديد مربوط بالقيمة form.neverExpires */}
              <input type="checkbox" name="neverExpires" checked={form.neverExpires} onChange={handleChange} id="neverExp" />
              {/* التسمية الخاصة بالمربع والتي يمكن الضغط عليها لتحديده */}
              <label htmlFor="neverExp" className={styles.checkboxLabel}>لا ينتهي أبداً (never expires)</label>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
}
