// استيراد مكتبة React الأساسية
import React from 'react';
// استيراد التنسيقات (CSS Profile) المخصصة لصفحة الإضافة
import styles from '../../pages/CreateUserPage.module.css';

// تعريف المكون الخاص باستقبال البيانات الأساسية للعميل الجديد 
// يستقبل form لتخزين القيم و handleChange لرصد التغييرات أثناء الكتابة
export default function CreateUserMainInfo({ form, handleChange }) {
  return (
    // حاوية تعطي مسافات بيضاء (Padding) حول عناصر النموذج
    <div className={styles.formPadding}>
      
      {/* ========================================= */}
      {/* 1. حقل إدخال اسم العميل */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية (Label) لخانة الاسم */}
        <div className={styles.labelColStyle}>الاسم (Name):</div>
        <div className={styles.inputColStyle}>
          {/* حقل نصي مطلوب (required) لإدخال الاسم */}
          <input type="text" name="name" value={form.name} onChange={handleChange} required className={styles.inputStyle} />
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. حقل إدخال اسم الشركة */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية (Label) لخانة الشركة */}
        <div className={styles.labelColStyle}>الشركة (Company):</div>
        <div className={styles.inputColStyle}>
          {/* حقل نصي غير إلزامي لإدخال اسم الشركة التابع لها العميل */}
          <input type="text" name="company" value={form.company} onChange={handleChange} className={styles.inputStyle} />
        </div>
      </div>

      {/* ========================================= */}
      {/* 3. حقل إدخال البريد الإلكتروني */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية لخانة الإيميل */}
        <div className={styles.labelColStyle}>البريد الإلكتروني (E-mail):</div>
        <div className={styles.inputColStyle}>
          {/* حقل مخصص لبريد العميل، نوعه email لعمل تحقق أساسي من المتصفح، وهو حقل مطلوب */}
          <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.inputStyle} />
        </div>
      </div>

      {/* ========================================= */}
      {/* 4. قائمة منسدلة لاختيار نوع رخصة العميل */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية لخانة نوع الرخصة */}
        <div className={styles.labelColStyle}>نوع الرخصة (Type):</div>
        <div className={styles.inputColStyle}>
          {/* قائمة منسدلة (Select Box) تحدد هل الرخصة مفردة أم جماعية */}
          <select name="type" value={form.type} onChange={handleChange} className={styles.inputStyle} style={{ width: 140 }}>
            {/* الخيار الأول: رخصة فردية */}
            <option value="individual">فردية (Individual)</option>
            {/* الخيار الثاني: رخصة جماعية (تسمح بتحديد عدد النسخ) */}
            <option value="group">جماعية (Group)</option>
          </select>
        </div>
      </div>

      {/* ========================================= */}
      {/* 5. حقل تحديد عدد التراخيص يظهر فقط للرخص الجماعية */}
      {/* ========================================= */}
      {form.type === 'group' && ( // شرط: إذا كان نوع الرخصة "جماعية" سيظهر الحقل التالي
        <div className={styles.rowStyle}>
          {/* التسمية التوضيحية لعدد التراخيص */}
          <div className={styles.labelColStyle}>عدد التراخيص (Licenses):</div>
          <div className={styles.inputColStyle}>
            {/* حقل رقمي يحدد العدد المطلوب ولا يقل عن 1 */}
            <input type="number" name="count_license" value={form.count_license} onChange={handleChange} min={1} className={styles.inputStyle} style={{ width: 80 }} />
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 6. تحديد تاريخ بدء الرخصة */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية لتاريخ البداية */}
        <div className={styles.labelColStyle}>تاريخ البدء (Start Date):</div>
        <div className={styles.inputColStyle}>
          {/* حقل روزنامة (date) يحدد متى تبدأ صلاحية رخصة العميل */}
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={styles.inputStyle} style={{ width: 140 }} />
        </div>
      </div>

      {/* ========================================= */}
      {/* 7. تحديد تاريخ انتهاء الرخصة (أو جعلها مفتوحة) */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية لتاريخ الانتهاء */}
        <div className={styles.labelColStyle}>صالح حتى (Valid until):</div>
        <div className={styles.inputColStyle}>
          {/* حقل روزنامة تحدد تاريخ الانتهاء، ويصبح معطلاً (disabled) في حال اختيار أن الرخصة لا تنتهي أبداً */}
          <input 
            type="date" 
            name="validUntil" 
            value={form.validUntil} 
            onChange={handleChange} 
            disabled={form.neverExpires} // تعطيل الحقل
            className={styles.inputStyle} 
            // تغيير لون الخلفية لرمادي في حالة تعطيل الحقل لبيان أنه غير قابل للتعديل
            style={{ width: 140, backgroundColor: form.neverExpires ? '#f5f5f5' : '#fff' }} 
          />
          {/* حاوية لزر الاختيار المربع (Checkbox) الذي يفيد بعدم الانتهاء */}
          <div className={styles.neverExpireContainer}>
            {/* زر التحديد ومربوط بحالة neverExpires */}
            <input type="checkbox" name="neverExpires" checked={form.neverExpires} onChange={handleChange} id="neverExp" />
            {/* التسمية الخاصة بزر التحديد */}
            <label htmlFor="neverExp" className={styles.neverExpireLabel}>لا تنتهي صلاحيته أبدًا (never expires)</label>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 8. حقل نصي لإضافة الملاحظات حول العميل */}
      {/* ========================================= */}
      <div className={styles.rowStyle}>
        {/* التسمية التوضيحية للملاحظات */}
        <div className={styles.labelColStyle}>ملاحظات (Notes):</div>
        <div className={styles.inputColStyle}>
          {/* مربع نصي (Textarea) بارتفاع متعدد (4 صفوف) لكتابة أي تفاصيل إضافية */}
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className={styles.inputStyle} style={{ resize: 'vertical' }} />
        </div>
      </div>

    </div>
  );
}
